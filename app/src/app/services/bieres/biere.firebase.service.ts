import { Injectable } from '@angular/core';
import { from, map, Observable, switchMap } from 'rxjs';
import { firebaseConfig } from 'src/environments/environment';
import { Biere, NoteBiere } from '../../models/biere';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  query,
  where,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class BiereService {
  private db;

  constructor() {
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
    this.db = getFirestore();
  }

  // 🔍 Récupère toutes les bières
  getBieres(): Observable<Biere[]> {
    const biereCollection = collection(this.db, 'bieres');
    return from(getDocs(biereCollection)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<Biere, 'id'>;
          return {
            id: docSnap.id,
            ...data,
          };
        })
      )
    );
  }

  // 🔍 Récupère une bière par ID
  getBiere(id: string): Observable<Biere> {
    const docRef = doc(this.db, 'bieres', id);
    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) {
          throw new Error('Bière non trouvée');
        }
        const data = docSnap.data() as Omit<Biere, 'id'>;
        return { id: docSnap.id, ...data };
      })
    );
  }

  addBiere(biere: Omit<Biere, 'id'>): Observable<Biere> {
    const biereCollection = collection(this.db, 'bieres');
    const data = JSON.parse(JSON.stringify(biere));

    return from(addDoc(biereCollection, data)).pipe(
      switchMap((docRef: DocumentReference) =>
        from(updateDoc(docRef, { id: docRef.id })).pipe(
          map(() => ({ id: docRef.id, ...data }))
        )
      )
    );
  }

  // ✏️ Met à jour une bière
  updateBiere(biere: Biere): Observable<void> {
    const docRef = doc(this.db, 'bieres', biere.id);
    const { id, ...data } = JSON.parse(JSON.stringify(biere));
    return from(updateDoc(docRef, data));
  }

  // ❌ Supprime une bière
  deleteBiere(id: string): Observable<void> {
    const docRef = doc(this.db, 'bieres', id);
    return from(deleteDoc(docRef));
  }

  // 🔍 Récupère toutes les notes
  getNotes(): Observable<NoteBiere[]> {
    const notesCollection = collection(this.db, 'notes');
    return from(getDocs(notesCollection)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<NoteBiere, 'id'>;
          return { id: docSnap.id, ...data };
        })
      )
    );
  }

  // 🔍 Récupère les notes d'une bière spécifique
  getNotesBiere(biereId: string): Observable<NoteBiere[]> {
    const notesCollection = collection(this.db, 'notes');
    const q = query(notesCollection, where('biereId', '==', biereId));
    return from(getDocs(q)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<NoteBiere, 'id'>;
          return { id: docSnap.id, ...data };
        })
      )
    );
  }

  // ➕ Ajoute une note
  addNote(note: Omit<NoteBiere, 'id'>): Observable<NoteBiere> {
    const notesCollection = collection(this.db, 'notes');
    const data = JSON.parse(JSON.stringify(note));

    return from(addDoc(notesCollection, data)).pipe(
      switchMap((docRef: DocumentReference) =>
        from(updateDoc(docRef, { id: docRef.id })).pipe(
          map(() => ({ id: docRef.id, ...data }))
        )
      )
    );
  }


  // ✏️ Met à jour une note
  updateNote(note: NoteBiere): Observable<void> {
    const docRef = doc(this.db, 'notes', note.id);
    const { id, ...data } = JSON.parse(JSON.stringify(note));
    return from(updateDoc(docRef, data));
  }

  // ❌ Supprime une note
  deleteNote(id: string): Observable<void> {
    const docRef = doc(this.db, 'notes', id);
    return from(deleteDoc(docRef));
  }
}
