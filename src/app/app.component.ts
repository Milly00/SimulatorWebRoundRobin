import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SimulatorProcess';

  items: any;

  constructor(firestore: AngularFirestore) {
    this.items = firestore.collectionGroup;
    console.log(this.items);

  }
}
