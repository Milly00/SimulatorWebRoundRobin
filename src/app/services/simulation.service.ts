import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import data from '../../assets/new.json';
@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  processReady: any[] = [];
  processExecution: any[] = [];
  processKeep: any[] = [];
  processEnd: any[] = [];
  processTable: any[] = [];

  TH: number = 4;
  quamtum: number = 14;
  timeTotal: number = 0;
  numberProces: number = 0;

  numberP = new BehaviorSubject(0);

  elementEsp !: any;


  firstElement: boolean = false;
  repeat = new BehaviorSubject(false);

  constructor(private httpClient: HttpClient) { }

  getProcess() {

    let i = 0;
    data.forEach(element => {
      let newObj = {
        PID: element.PID,
        estado: element.estado,
        nombre_imagen: element.nombre_imagen,
        nombre_sesion: element.nombre_sesion,
        nombre_usuario: element.nombre_usuario,
        numero_sesion: element.numero_sesion,
        titulo_ventana: element.titulo_ventana,
        tiempo_CPU: element.tiempo_CPU,
        uso_memoria: element.uso_memoria,
        tiempo_rafaga: this.TH * (element.nombre_imagen.length),
        prioridad: 0,
      }

      if (element.nombre_usuario.includes("SYSTEM") || element.nombre_usuario.includes("N/D")) {
        newObj["prioridad"] = 1;
      }

      i++;

      this.timeTotal = this.timeTotal + newObj.tiempo_rafaga;
      this.pushReady(newObj);
      console.log(newObj);


    });

    this.numberProces = i;

    this.numberP.next(i);

  }

  getTableProcess() {
    console.log(this.processReady);
  }


  /**
   * Método donde hacemos los cambios de un array a otro
   */
  initL() {

    let i = 0;
    let contEx = 0;//cuenta las veces que se itera, lo usaremos para controlar los procesos

    let x = setInterval(() => {
      //console.log(p);


      let element;//Guardara la info del proceso

      //Si tenemos procesos listos pasamos el primer elemento a ejecuión
      if (this.processReady.length > 0) {
        //Nos aseguramos de agregar el primer elemento del array de listos
        //a ejecución
        if (contEx === 0 || this.firstElement === false) {


          element = this.processReady.shift();//Capturamos el primer proceso de listos

          if (element.tiempo_rafaga < this.quamtum) {
            this.quamtum = element.tiempo_rafaga;

          }
          //Verificamos que el proceso tenga info
          if (element !== undefined) {

            //Asignamos el proceso a ajecución
            this.pushExecution(element);

            //Decimos que ya hay un elemento en ejecución
            if (this.processExecution.length > 0) {
              this.firstElement = true;
            }
          }
        }


        //Si el contador es igual alquamtum, decimos que ya el proceso termino de ejecutarse
        if (contEx === (this.quamtum - 1) && this.firstElement === true) {
          element = this.processReady.shift();

          //Si tiempo de rafaga es menor al quamtum decimos que el quamtum es igual  al tiempo de 
          //ráfaga ya que el proceso no va a ocupar el tiempo en si
          if (element.tiempo_rafaga < this.quamtum) {
            this.quamtum = element.tiempo_rafaga;
          }
          const lenEx = this.processExecution.length;
          this.pushExecution(element, contEx);

          contEx = 0;
        }

      }
      //Vamos disminuyendo las iteraciones
      i++;
      contEx++;

      if (this.timeTotal === 0) {
        this.stopLoop(x);
      }

      this.timeTotal = this.timeTotal - 1;

    }, 100);
  }



  /**
   * Detiene el set interval
   * @param i 
   */
  stopLoop(i: any) {
    clearInterval(i);
  }

  /**
   * Retorna el array de Listos
   * @returns 
   */
  getReady() {
    return this.processReady;
  }

  /**
   * Retorna el array de ejecución
   * @returns 
   */
  getExexution() {
    return this.processExecution;
  }

  /**
   * Retorna el array de espera
   * @returns 
   */
  getKepp() {
    return this.processKeep
  }

  getEnd() {
    return this.processEnd;
  }

  getTable() {
    return this.processTable;
  }
  /**
   * Método para llenar el array de procesos listos listos
   * @param element 
   */
  pushReady(element: any) {
    const objEx = {
      PID: element.PID,
      estado: element.estado,
      nombre_imagen: element.nombre_imagen,
      uso_memoria: element.uso_memoria,
      tiempo_rafaga: element.tiempo_rafaga
    }
    this.processReady.push(objEx);
  }


  pushTable(element: any) {
    const newObj = {
      PID: element.PID,
      estado: element.estado,
      nombre_imagen: element.nombre_imagen,
      nombre_sesion: element.nombre_sesion,
      nombre_usuario: element.nombre_usuario,
      numero_sesion: element.numero_sesion,
      titulo_ventana: element.titulo_ventana,
      tiempo_CPU: element.tiempo_CPU,
      uso_memoria: element.uso_memoria,
      tiempo_rafaga: element.tiempo_rafaga,
    }

    this.processTable.push(newObj);
  }
  /**
   * Metodo para llenar el array de los procesos en ejecución
   * @param element 
   * @param cont 
   */
  pushExecution(element: any, cont?: number) {

    const objEx = {
      PID: element.PID,
      estado: element.estado,
      nombre_imagen: element.nombre_imagen,
      uso_memoria: element.uso_memoria,
      tiempo_rafaga: element.tiempo_rafaga - this.quamtum
    }
    this.processExecution.push(objEx);
    //console.log(objEx);

    //Si el contador de las ietraciones es igual a nuestro quamtum
    //Quiere decir que ya termino el primer proceso en ejecución por lo tanto
    //Pasamos el siguiente proceso de listo a ejecución

    if (cont === (this.quamtum - 1)) {
      const data = this.processExecution.shift(); //---> El 1er elto de ejecución lo pasamos a espera

      //Si el tiempo de rafaga es menor al quamtum, pasamos este proceso a finalizado
      if (data.tiempo_rafaga < this.quamtum) {
        this.pushFinalizado(data);
        //console.log(this.numberProces);
        //Disminuimos el número de procesos a ejecutar
        this.numberProces = this.numberProces - 1;
        this.numberP.next(this.numberProces);

      } else {
        //Si no pasamos el proceso nuevamente a espera
        this.pushEspera(data);
      }
    }

  }

  /**
   * Método para llenar el array de los procesos en espera
   * @param element 
   */
  pushEspera(element: any) {
    const objEx = {
      PID: element.PID,
      estado: element.estado,
      nombre_imagen: element.nombre_imagen,
      uso_memoria: element.uso_memoria,
      tiempo_rafaga: element.tiempo_rafaga
    }
    this.processKeep.push(objEx);

    //console.log(this.processKeep.length, this.numberProces - 1);

    this.numberP.subscribe(num => {
      if (this.processKeep.length >= num - 1) {
        for (let index = 0; index < this.processKeep.length; index++) {
          const data = this.processKeep.shift();
          this.pushReady(data);
        }
      }
    })

    //console.log("En espera", this.processKeep);
  }
  /**
   * Metodo para llenar el array de los procesos finalizados
   * @param element 
   */
  pushFinalizado(element: any) {
    const objEx = {
      PID: element.PID,
      estado: element.estado,
      nombre_imagen: element.nombre_imagen,
      uso_memoria: element.uso_memoria,
      tiempo_rafaga: element.tiempo_rafaga
    }
    this.processEnd.push(objEx);

  }




}
