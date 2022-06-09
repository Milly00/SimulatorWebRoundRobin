import { Component, OnInit } from '@angular/core';
import { SimulationService } from '../../services/simulation.service';

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

  constructor(private round: SimulationService) {

  }

  ngOnInit(): void {
    this.getDatos();

    this.ready = this.round.getReady();
    this.keep = this.round.getKepp();
    this.Execution = this.round.getExexution();
    this.End = this.round.getEnd();


  }


  getDatos() {
    this.round.getProcess();

  }

  getEx() {
    this.round.getExexution();
  }

  getList() {
    this.round.initL();
  }





}
