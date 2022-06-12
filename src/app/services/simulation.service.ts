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

  tableProcess: any[] = [];

  TH: number = 4;
  quamtum: number = 24;
  quamtumUser: number = 0;
  timeTotal: number = 0;
  numberProces: number = 0;
  totalProces: number = 0;

  numberP = new BehaviorSubject(0);

  elementEsp !: any;

  pauseLoop = new BehaviorSubject<any>(0);

  iterator = new BehaviorSubject<any>(0);


  pauseOn: boolean = false;
  counter: number = 0;

  firstElement: boolean = false;
  repeat = new BehaviorSubject(false);

  constructor(private httpClient: HttpClient) { }

  getProcess(data: any[], th: number, quamtum: number) {

    this.quamtum = quamtum;
    this.quamtumUser = quamtum;

    let i = 0;
    data.forEach(element => {
      let newObj = {
        nombre_imagen: element.processName,
        tiempo_rafaga: th * (element.processName.length),
        tiempo_llegada: i,
        prioridad: parseInt(element.priority),
        id: element.id,
        capture: element.capture,
      }


      i++;

      this.timeTotal = this.timeTotal + newObj.tiempo_rafaga;
      this.pushReady(newObj);
    });

    this.numberProces = i;

    this.totalProces = i;
    this.numberP.next(i);

    console.log(this.timeTotal);

    this.timeTotal = 500;



  }

  getTableProcess() {
    console.log(this.processReady);
  }

  /**
   * Verificamos nuestro quamtum o lo que demorara el proceso en ejecutarse
   * @param element 
   */
  getQuamtum(element: any) {

    if (element.tiempo_rafaga >= 0) {

      if (element.prioridad === 1) {
        this.quamtum = element.tiempo_rafaga;

      }

      if (element.prioridad === 0) {
        this.quamtum = this.quamtumUser;
        if (element.tiempo_rafaga > this.quamtum) {
          this.quamtum = this.quamtumUser;

        } else {

          this.quamtum = element.tiempo_rafaga;

        }
      }

    }

  }


  getCounter(n: number) {
    this.counter = n;
  }
  /**
   * Método donde hacemos los cambios de un array a otro
   */
  initL() {

    let i = 1;
    let contEx = 0;//cuenta las veces que se itera, lo usaremos para controlar los procesos

    if (this.counter > 0) {
      contEx = this.counter
    }
    let x = setInterval(() => {
      let element;//Guardara la info del proceso

      //Si tenemos procesos listos pasamos el primer elemento a ejecuión
      if (this.processReady.length > 0) {
        //Nos aseguramos de agregar el primer elemento del array de listos
        //a ejecución
        if (this.firstElement === false) {


          element = this.processReady.shift();//Capturamos el primer proceso de listos

          //Verificamos que el proceso tenga info
          if (element !== undefined) {

            this.getQuamtum(element);
            //El contador sera igual a nuetsro quamtum e ira disminuyendo
            contEx = this.quamtum;
            //Asignamos el proceso a ajecución
            this.pushExecution(element);
            //Decimos que ya hay un elemento en ejecución
            if (this.processExecution.length > 0) {
              this.firstElement = true;
            }
          }
        }


        //Si el contador es igual a 0, decimos que ya el proceso termino de ejecutarse
        if (contEx === 0 && this.firstElement === true) {
          element = this.processReady.shift();

          //Si tiempo de rafaga es menor al quamtum decimos que el quamtum es igual  al tiempo de 
          //ráfaga ya que el proceso no va a ocupar el tiempo en si
          this.getQuamtum(element);
          const lenEx = this.processExecution.length;
          this.pushExecution(element, contEx);

          contEx = this.quamtum;
        }

      }
      //Vamos disminuyendo las iteraciones
      i++;

      this.iterator.next(contEx);
      contEx--;

      this.getCounter(contEx);


      if (this.totalProces === this.processEnd.length) {
        this.stopLoop(x);
      }

      this.pauseLoop.next(x);


      if (this.processReady.length <= 0 && this.processKeep.length <= 0 && this.processExecution.length > 0) {
        this.pushFinalizado(this.processExecution.shift());
        this.stopLoop(x);
      }



    }, 100);

    console.log(this.counter);

  }




  /**
   * Detiene el set interval
   * @param i 
   */
  stopLoop(i: any) {
    clearInterval(i);
    this.pauseOn = true;
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
      nombre_imagen: element.nombre_imagen,
      tiempo_rafaga: element.tiempo_rafaga,
      tiempo_llegada: element.tiempo_llegada,
      prioridad: element.prioridad,
      id: element.id,
      capture: element.capture,
    }

    this.processReady.push(objEx);

  }


  pushTable(element: any, rafaga: number) {
    let procesoAnterior;
    let finalizacionAnt = 0;

    if (this.processTable.length > 0) {
      procesoAnterior = this.processTable[this.processTable.length - 1];

    }
    const newObj = {
      //PID: element.PID,
      nombre_imagen: element.nombre_imagen,
      tiempo_rafaga: element.tiempo_rafaga,
      tiempo_llegada: element.tiempo_llegada,
      tiempo_finalizacion: 0,
      retorno: 0,
      id: element.id,
      capture: element.capture,
    }

    if (this.processTable.length <= 0) {
      newObj["tiempo_finalizacion"] = newObj.tiempo_rafaga;

    }

    if (typeof this.processTable === 'object' && procesoAnterior !== undefined) {
      finalizacionAnt = procesoAnterior.tiempo_finalizacion
    }

    newObj["tiempo_finalizacion"] = rafaga + finalizacionAnt;
    newObj["retorno"] = newObj.tiempo_finalizacion - newObj.tiempo_llegada;

    if (newObj.retorno < 0) {
      newObj.retorno = 0;
    }

    this.processTable.push(newObj);
  }


  /**
   * Metodo para llenar el array de los procesos en ejecución
   * @param element 
   * @param cont 
   */
  pushExecution(element: any, cont?: number) {

    let time_rafaga = 0;//Var local para guardar el tiempo de rafaga
    time_rafaga = element.tiempo_rafaga;

    let obEx = {};

    /**
     * Nos aseguramos de que la rafaga no vaya a ser negativa
     */
    if (time_rafaga >= this.quamtum) {
      obEx = {
        nombre_imagen: element.nombre_imagen,
        tiempo_rafaga: element.tiempo_rafaga - this.quamtum,
        tiempo_llegada: element.tiempo_llegada,
        prioridad: element.prioridad,
        id: element.id,
        capture: element.capture,
      }

    } else {
      obEx = {
        nombre_imagen: element.nombre_imagen,
        tiempo_rafaga: element.tiempo_rafaga,
        tiempo_llegada: element.tiempo_llegada,
        prioridad: element.prioridad,
        id: element.id,
        capture: element.capture,
      }
    }





    let rafaga = 0;//Variable que se utiliza para hacer los calculos en la tabla 

    /** */
    if (element.prioridad === 1) {
      rafaga = element.tiempo_rafaga
    } else {
      rafaga = this.quamtum
    }


    this.pushTable(element, rafaga);


    this.processExecution.push(obEx);

    //Si el contador de las ietraciones es igual a nuestro quamtum
    //Quiere decir que ya termino el primer proceso en ejecución por lo tanto
    //Pasamos el siguiente proceso de listo a ejecución

    //console.log("CONT" + cont, "QUAMTUM " + this.quamtum);


    if (cont === 0) {
      const data = this.processExecution.shift(); //---> El 1er elto de ejecución lo pasamos a espera

      //Si el tiempo de rafaga es menor al quamtum, pasamos este proceso a finalizado
      if (data.tiempo_rafaga > this.quamtum) {

        //Si no pasamos el proceso nuevamente a espera
        this.pushEspera(data);
      }

      if (data.tiempo_rafaga <= this.quamtum) {

        //Si el proceso su tiempo es 0, quiere decir que termino
        if (data.tiempo_rafaga === 0) {
          this.pushFinalizado(data);

          this.numberProces = this.numberProces - 1;
          this.numberP.next(this.numberProces);

        } else {

          //Si no, aún le falta un poco de tiempo para finalizar
          this.pushEspera(data);
        }
        //Disminuimos el número de procesos a ejecutar
      }
    }



  }

  /**
   * Método para llenar el array de los procesos en espera
   * @param element 
   */
  pushEspera(element: any) {
    const objEx = {
      nombre_imagen: element.nombre_imagen,
      tiempo_rafaga: element.tiempo_rafaga,
      tiempo_llegada: element.tiempo_llegada,
      prioridad: element.prioridad,
      id: element.id,
      capture: element.capture,

    }

    this.processKeep.push(objEx);


    this.numberP.subscribe(num => {
      //Si el tamaño de nuestro array de espera es mayor al tamañao del 
      //número de procesos que aún nos faltan por finalizar, pasamos los
      //datos a listos
      if (this.processKeep.length >= num - 1) {
        for (let index = 0; index < this.processKeep.length; index++) {
          const data = this.processKeep.shift();
          this.pushReady(data);
        }
      }
    })

  }
  /**
   * Metodo para llenar el array de los procesos finalizados
   * @param element 
   */
  pushFinalizado(element: any) {
    const objEx = {
      nombre_imagen: element.nombre_imagen,
      tiempo_rafaga: element.tiempo_rafaga,
      tiempo_llegada: element.tiempo_llegada,
      prioridad: element.prioridad,
      id: element.id,
      capture: element.capture,

    }
    this.processEnd.push(objEx);
  }




}
