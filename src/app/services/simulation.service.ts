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
  quamtum: number = 14;
  timeTotal: number = 0;
  numberProces: number = 0;

  numberP = new BehaviorSubject(0);

  elementEsp !: any;

  pauseLoop = new BehaviorSubject<any>(0);

  pauseOn: boolean = false;
  counter: number = 0;

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
        tiempo_llegada: i,
        prioridad: 0,
      }

      if (element.nombre_usuario.includes("SYSTEM") || element.nombre_usuario.includes("N/D")) {
        newObj["prioridad"] = 1;
      } else {
        newObj["prioridad"] = 0;
      }

      i++;

      this.timeTotal = this.timeTotal + newObj.tiempo_rafaga;
      this.pushReady(newObj);
      // this.pushTable(newObj, newObj.tiempo_rafaga);


    });

    this.numberProces = i;

    this.numberP.next(i);

  }

  getTableProcess() {
    console.log(this.processReady);
  }

  /**
   * Verificamos nuestro quamtum o lo que demorara el proceso en ejecutarse
   * @param element 
   */
  getQuamtum(element: any) {
    console.log("TIEMPO RAFAGA", element.tiempo_rafaga);

    if (element.prioridad === 1) {
      this.quamtum = element.tiempo_rafaga;

    } else {
      console.log(element.prioridad, this.quamtum);

      if (element.prioridad === 0) {

        if (element.tiempo_rafaga < this.quamtum) {
          this.quamtum = 14;

        } if (element.tiempo_rafaga > this.quamtum) {
          this.quamtum = 14;

        } else {

          this.quamtum = element.tiempo_rafaga;

        }
      }


    }
  }


  getCounter(n: number) {
    this.counter = n;
    //console.log(this.counter);

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

      contEx--;

      this.getCounter(contEx);


      if (this.timeTotal === 0) {
        this.stopLoop(x);
      }

      this.pauseLoop.next(x);

      if (this.processReady.length <= 0 && this.processKeep.length <= 0 && this.processExecution.length > 0) {
        //console.log("Terminamos");
        //console.log(this.processExecution);
        this.pushFinalizado(this.processExecution.shift());
        this.stopLoop(x);


      }

      this.timeTotal = this.timeTotal - 1;

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
      PID: element.PID,
      estado: element.estado,
      nombre_imagen: element.nombre_imagen,
      uso_memoria: element.uso_memoria,
      tiempo_rafaga: element.tiempo_rafaga,
      tiempo_llegada: element.tiempo_llegada,
      prioridad: element.prioridad,
    }

    this.processReady.push(objEx);

  }


  pushTable(element: any, rafaga: number) {
    let procesoAnterior;
    let finalizacionAnt = 0;
    //console.log(this.processTable.length);

    if (this.processTable.length > 0) {
      procesoAnterior = this.processTable[this.processTable.length - 1];

    }
    const newObj = {
      PID: element.PID,
      estado: element.estado,
      nombre_imagen: element.nombre_imagen,
      uso_memoria: element.uso_memoria,
      tiempo_rafaga: element.tiempo_rafaga,
      tiempo_llegada: element.tiempo_llegada,
      tiempo_finalizacion: 0,
      retorno: 0
    }

    if (this.processTable.length <= 0) {
      newObj["tiempo_finalizacion"] = newObj.tiempo_rafaga;

    }

    if (typeof this.processTable === 'object' && procesoAnterior !== undefined) {
      //console.log(procesoAnterior);

      finalizacionAnt = procesoAnterior.tiempo_finalizacion
    }

    //console.log(rafaga + finalizacionAnt);

    //console.log(rafaga);

    newObj["tiempo_finalizacion"] = rafaga + finalizacionAnt;
    newObj["retorno"] = newObj.tiempo_finalizacion - newObj.tiempo_llegada;

    if (newObj.retorno < 0) {
      newObj.retorno = 0;
    }

    this.processTable.push(newObj);


    console.log(this.processTable);

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
      tiempo_rafaga: element.tiempo_rafaga - this.quamtum,
      tiempo_llegada: element.tiempo_llegada,
      prioridad: element.prioridad
    }

    const objTable = {
      PID: element.PID,
      estado: element.estado,
      nombre_imagen: element.nombre_imagen,
      uso_memoria: element.uso_memoria,
      tiempo_rafaga: element.tiempo_rafaga,
      tiempo_llegada: element.tiempo_llegada,
      prioridad: element.prioridad
    }

    //console.log(objEx);

    let rafaga = 0;

    if (element.prioridad === 1) {
      rafaga = element.tiempo_rafaga
    } else {
      rafaga = this.quamtum
    }
    this.pushTable(objTable, rafaga);

    this.processExecution.push(objEx);

    //Si el contador de las ietraciones es igual a nuestro quamtum
    //Quiere decir que ya termino el primer proceso en ejecución por lo tanto
    //Pasamos el siguiente proceso de listo a ejecución

    //console.log("CONT" + cont, "QUAMTUM " + this.quamtum);


    if (cont === 0) {
      //console.log("YES");
      const data = this.processExecution.shift(); //---> El 1er elto de ejecución lo pasamos a espera

      //Si el tiempo de rafaga es menor al quamtum, pasamos este proceso a finalizado
      //console.log("RAFAGA " + data.tiempo_rafaga, "QUAMTUM" + this.quamtum);


      if (data.tiempo_rafaga > this.quamtum) {
        //console.log("ESPERA");

        //Si no pasamos el proceso nuevamente a espera
        this.pushEspera(data);
      } else {

        //Si el proceso su tiempo es 0, quiere decir que termino
        if (data.tiempo_rafaga === 0) {
          this.pushFinalizado(data);
          console.log(element.tiempo_rafaga);



        } else {
          //Si no, aún le falta un poco de tiempo para finalizar
          this.pushEspera(data);
        }
        //console.log(this.numberProces);
        //Disminuimos el número de procesos a ejecutar
        this.numberProces = this.numberProces - 1;
        this.numberP.next(this.numberProces);
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
      tiempo_rafaga: element.tiempo_rafaga,
      tiempo_llegada: element.tiempo_llegada,
      prioridad: element.prioridad

    }

    this.processKeep.push(objEx);


    //console.log(this.processKeep.length, this.numberProces - 1);


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
      tiempo_rafaga: element.tiempo_rafaga,
      tiempo_llegada: element.tiempo_llegada,
      prioridad: element.prioridad

    }
    this.processEnd.push(objEx);
  }




}
