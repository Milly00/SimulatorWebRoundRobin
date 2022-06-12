import { Component, OnInit } from '@angular/core';
import { SimulationService } from '../../services/simulation.service';
import { BehaviorSubject } from 'rxjs';
import { ConectionService } from '../../services/database/conection.service';

@Component({
  selector: 'app-round-robin-process',
  templateUrl: './round-robin-process.component.html',
  styleUrls: ['./round-robin-process.component.scss']
})
export class RoundRobinProcessComponent implements OnInit {

  ready: any[] = [];
  keep: any[] = [];
  Execution: any[] = [];
  End: any[] = [];

  table: any[] = [];


  constructor(private round: SimulationService, private database: ConectionService) {

  }

  ngOnInit(): void {
    this.getDatos();

    this.ready = this.round.getReady();
    this.keep = this.round.getKepp();
    this.Execution = this.round.getExexution();
    this.End = this.round.getEnd();

    console.log(this.table);
    this.showTable();

  }



  getDatos() {
    this.round.getProcess();
    //const da = this.database.getProcess("MAYOR_CPU");
    this.database.getUsers("MAYOR_CPU").subscribe(data => {
      console.log(data);

    })
  }

  getEx() {
    this.round.getExexution();
  }

  getList() {
    this.round.initL();
  }

  pause() {
    this.round.pauseLoop.subscribe(data => {
      console.log(data);
      this.round.stopLoop(data);
    })
  }

  showTable() {
    this.table = this.round.getTable();

  }



}
