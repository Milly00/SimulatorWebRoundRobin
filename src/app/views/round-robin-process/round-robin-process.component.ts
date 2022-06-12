import { Component, OnInit } from '@angular/core';
import { Process } from 'src/app/interface/process';
import { ConnectionService } from 'src/app/services/database/connection.service';
import { SimulationService } from '../../services/simulation.service';
import { ProcessModel } from '../../interface/process-model';
import { Initial } from '../../interface/initial';

@Component({
  selector: 'app-round-robin-process',
  templateUrl: './round-robin-process.component.html',
  styleUrls: ['./round-robin-process.component.scss']
})
export class RoundRobinProcessComponent implements OnInit {

  //Selectores
  public lista: Process[] = [
    {
      value: "MAYOR_CPU",
      name: "Mayor uso de CPU"
    },
    {
      value: "MENOR_CPU",
      name: "Menor uso de CPU"
    },
    {
      value: "MAYOR_RAM",
      name: "Mayor uso de RAM"
    },
    {
      value: "MENOR_RAM",
      name: "Menor uso de RAM"
    },
    {
      value: "USUARIO",
      name: "Procesos de usuario"
    },
    {
      value: "SISTEMA",
      name: "Procesos de sistema"
    },
  ];
  //Valor inicial 
  selected: Process = {
    value: "MAYOR_CPU",
    name: "Mayor uso de CPU",
  };

  //Valor de la caja de textp
  //th
  text: String = "";
  //cuantum
  quatum: String = "";
  //tiempo total de rafaga
  totalRafaga: number = 0;
  //no recuerdo pa qué :V
  itemS: String = "MAYOR_CPU"
  /** 
  * Array de los proccesos obtenidos en 
  * @return @getProcess
  */
  private listProcess: ProcessModel[] = [];

  //Valores inciales, de acuerdo al llamado 
  initial: Initial[] = [];
  /** 
  *array @process para los procesos con su respectiva rafaga
   *  @method  @createTableProcess
   *  hace referencia al array listos 
   */
  listos: Initial[] = [];
  private local: Initial[] = [];
  ejecucion: Initial = {
    process: "",
    tr: 0
  }
  /*array para finalizados
   */
  terminados: Initial[] = [];

  /**
   * 
   * @param round 
   * @param connectionD 
   */
  constructor(private round: SimulationService, private connectionD: ConnectionService) {
  }
  ngOnInit(): void {
  }
  //Obtiene el item seleccionado 
  changeItem(value: any) {
    this.itemS = value.target.value;
  }
  //Obtiene la lista de proceso
  async getProcess() {
    this.listProcess = await this.connectionD.getProcess(this.itemS);
    
    this.createTableProcess();
  }
  //Construye la tabla de los procesos con la rafaga --> sin emular
  private createTableProcess() {
    this.listos = [];
    this.initial = [];
    this.listProcess.forEach(element => {
      this.listos.push({
        process: element.processName,
        tr: element.processName.length * Number(this.text)
      });
      this.initial.push({
        process: element.processName,
        tr: element.processName.length * Number(this.text)
      });
    });
    this.totalRafaga = this.initial.map(item => item.tr).reduce((prev, curr) => prev + curr, 0);
  }

  //Iniciar proceso
  async run() {
    let q = Number(this.quatum);
    let espera: Initial[] = [];
    let i = 0;
    let interval = setInterval(() => {



      let dele = this.listos.shift();
      let rfc = this.listos.map(item => item.tr).reduce((prev, curr) => prev + curr, 0);
      this.ejecucion.process = dele?.process + "";
      this.ejecucion.tr = Number(dele?.tr)

      if (this.ejecucion.tr < q) {
        q = this.ejecucion.tr;
      }
      if ((this.ejecucion.tr - q) <= 0) {
        this.terminados.push({
          process: this.ejecucion.process,
          tr: 0
        });
      }
      if ((this.ejecucion.tr - q) > 0) {
        espera.push({
          process: this.ejecucion.process,
          tr: this.ejecucion.tr - q
        });
      }
      if (this.listos.length==0) {
        console.log("aaaaaaaa");
        
        this.listos = espera;
        espera =[];
        this.ejecucion.process =  "";
        this.ejecucion.tr = 0;
      }
      this.totalRafaga = this.totalRafaga - q;
      if (this.totalRafaga === 0) {
        clearInterval(interval);
      }
    }, 1000);
  }


}
