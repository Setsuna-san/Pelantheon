import { Injectable } from '@angular/core';
import { from, map, Observable, switchMap } from 'rxjs';
import { firebaseConfig } from 'src/environments/environment';
import { Biere, NoteBiere } from 'src/app/models/biere';
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
  orderBy,
} from 'firebase/firestore';
import { User } from 'src/app/models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BiereService {
  private db;

  constructor(private http: HttpClient) {
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
    this.db = getFirestore();
  }

  //nutriments , alcohol, generic_name_fr, image_front_small_url

  indexBieresById(bieres: Biere[]): { [id: string]: Biere } {
    return bieres.reduce((acc, biere) => {
      acc[biere.id] = biere;
      return acc;
    }, {} as { [id: string]: Biere });
  }

  getInformations(
    code: string
  ): Observable<{ name: string; image: string; alcool: string; type: string }> {
    const url = `https://world.openfoodfacts.org/api/v2/product/${code}`;
    console.log('debut getInfo');
    return this.http.get<any>(url).pipe(
      map((data) => ({
        name: data.product?.generic_name_fr ?? null,
        image: data.product?.image_front_small_url ?? null,
        alcool: data.product?.nutriments?.alcohol ?? null,
        type: data.product?.ecoscore_data?.agribalyse?.name_fr ?? null,
      }))
    );
  }

  // 🔍 Récupère toutes les bières
  getBieres(): Observable<Biere[]> {
    const biereCollection = collection(this.db, 'bieres');
    const q = query(biereCollection, orderBy('note', 'desc'));
    return from(getDocs(q)).pipe(
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

  getBiereByEan(ean: string): Observable<Biere> {
    const biereCollection = collection(this.db, 'bieres');
    const q = query(biereCollection, where('ean', '==', ean));
    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        if (querySnapshot.empty) {
          throw new Error('Bière non trouvée');
        }
        const docSnap = querySnapshot.docs[0];
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
    if (typeof data.note === 'number') {
      data.note = parseFloat(data.note.toFixed(2));
    }
    return from(updateDoc(docRef, data));
  }

  // ❌ Supprime une bière
  deleteBiere(id: string): Observable<void> {
    const docRef = doc(this.db, 'bieres', id);
    return from(deleteDoc(docRef));
  }

  deleteNoteByBiereId(id: string): Observable<void> {
    const notesCollection = collection(this.db, 'notes');
    const q = query(notesCollection, where('biereId', '==', id));

    return from(
      getDocs(q).then((snapshot) => {
        const deletions = snapshot.docs.map((d) =>
          deleteDoc(doc(this.db, 'notes', d.id))
        );
        return Promise.all(deletions).then(() => undefined);
      })
    );
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
    const q = query(
      notesCollection,
      where('biereId', '==', biereId),
      orderBy('note', 'desc')
    );
    return from(getDocs(q)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<NoteBiere, 'id'>;
          return { id: docSnap.id, ...data };
        })
      )
    );
  }

  getNotesUser(userId: string): Observable<NoteBiere[]> {
    const notesCollection = collection(this.db, 'notes');

    const q = query(
      notesCollection,
      where('userId', '==', userId),
      orderBy('note', 'desc')
    );
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

  // ➕ Ajoute un utilisateur
  addUser(user: Omit<User, 'id'>): Observable<User> {
    const usersCollection = collection(this.db, 'users');
    const data = JSON.parse(JSON.stringify(user));

    return from(addDoc(usersCollection, data)).pipe(
      switchMap((docRef: DocumentReference) =>
        from(updateDoc(docRef, { id: docRef.id })).pipe(
          map(() => ({ id: docRef.id, ...data }))
        )
      )
    );
  }

  // 🔍 Récupère tous les utilisateurs
  getUsers(): Observable<User[]> {
    const usersCollection = collection(this.db, 'users');
    return from(getDocs(usersCollection)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<User, 'id'>;
          return { id: docSnap.id, ...data };
        })
      )
    );
  }

  // 🔍 Récupère un utilisateur par ID
  getUser(id: string): Observable<User> {
    const docRef = doc(this.db, 'users', id);
    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) {
          throw new Error('Utilisateur non trouvé');
        }
        const data = docSnap.data() as Omit<User, 'id'>;
        return { id: docSnap.id, ...data };
      })
    );
  }

  // ✏️ Met à jour un utilisateur
  updateUser(user: User): Observable<void> {
    const docRef = doc(this.db, 'users', user.id);
    const { id, ...data } = JSON.parse(JSON.stringify(user));
    return from(updateDoc(docRef, data));
  }

  // ❌ Supprime un utilisateur
  deleteUser(id: string): Observable<void> {
    const docRef = doc(this.db, 'users', id);
    return from(deleteDoc(docRef));
  }
}
