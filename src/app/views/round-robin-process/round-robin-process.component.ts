import { Component, OnInit } from '@angular/core';
import { SimulationService } from '../../services/simulation.service';
import { BehaviorSubject } from 'rxjs';
import { ConectionService } from '../../services/database/conection.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  iterator: number = 0;

  selectedValue: string = "";

  selectFormControl = new FormControl('', Validators.required);

  thFormControl = new FormControl('', Validators.required);

  quamtumFormControl = new FormControl('', Validators.required);


  activedButton: boolean = false;




  options = [
    { value: 'MAYOR_CPU', viewValue: 'Steak' },
    { value: 'MAYOR_RAM', viewValue: 'Pizza' },
    { value: 'MENOR_CPU', viewValue: 'Tacos' },
    { value: 'MENOR_RAM', viewValue: 'Pizza' },
    { value: 'SISTEMA', viewValue: 'Pizza' },
    { value: 'SISTEMA', viewValue: 'Pizza' },


  ];


  constructor(private round: SimulationService, private database: ConectionService, private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    // this.getDatos();

    this.ready = this.round.getReady();
    this.keep = this.round.getKepp();
    this.Execution = this.round.getExexution();
    this.End = this.round.getEnd();

    console.log(this.table);
    this.showTable();

    this.round.iterator.subscribe(d => {
      this.iterator = d;
    })

  }


  getValue(event: any) {

    console.log(event.source.value);
    //this.selectedValue = event.source.value;
    //console.log(this.selectedValue);


  }

  getDatos() {
    //const da = this.database.getProcess("MAYOR_CPU");
    console.log(this.selectFormControl.value);

    console.log(this.thFormControl.value);

    console.log(this.quamtumFormControl.value);


    let option = this.selectFormControl.value;
    let th = this.thFormControl.value;
    let quamtum = this.quamtumFormControl.value;

    if (option !== undefined && option !== "" && th !== undefined && quamtum !== undefined

      && th !== '' && quamtum !== '') {

      this.database.getUsers(option).subscribe(data => {
        console.log(data);
        this.round.getProcess(data, th, quamtum);

        this.activedButton = true;
      });


    } else {
      this.openSnackBar();
      this.activedButton = false;

    }

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

  openSnackBar() {
    this._snackBar.open('Debe de llenar todos los campos antes de iniciar', 'Ok', {
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }



}
