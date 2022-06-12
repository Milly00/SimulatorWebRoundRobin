import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConectionService {

  private listProcess: any[] = [];
  constructor(private firestore: AngularFirestore) {
  }


  async getProcess(nameCollectin: String) {
    let docs = this.firestore.collection(nameCollectin.toString(), ref => ref.orderBy("id", 'asc')).snapshotChanges();
    await docs.subscribe(d => {
      this.listProcess = [];

      d.forEach((e: any) => {
        console.log(e.payload.doc.data());

        this.listProcess.push({
          ...e.payload.doc.data()
        })
      })
    });
    return this.listProcess;
  }

  getUsers(nameCollectin: String): Observable<any[]> {
    console.log('[Admin service] Ejecutando metodo')
    let docs = this.firestore.collection(nameCollectin.toString(), ref => ref.orderBy("id", 'asc')).snapshotChanges();

    return docs.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}
