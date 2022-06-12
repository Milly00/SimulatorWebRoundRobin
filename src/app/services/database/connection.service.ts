import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ProcessModel } from '../../interface/process-model';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private listProcess: ProcessModel[] = [];
  constructor(private firestore: AngularFirestore) {
  }


 async getProcess(nameCollectin: String) {
  let docs = this.firestore.collection(nameCollectin.toString(), ref => ref.orderBy("id", 'asc')).snapshotChanges();
  await docs.subscribe(d => {
      this.listProcess =[];

      d.forEach((e: any) => {
        this.listProcess.push({
          ...e.payload.doc.data()
        })
      })
    });
    return this.listProcess;
  }
}
