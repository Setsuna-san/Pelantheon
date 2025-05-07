import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, map, Observable, switchMap } from 'rxjs';
import { environment, firebaseConfig } from 'src/environments/environment';
import { Biere, NoteBiere } from 'src/app/models/biere';

import { User } from 'src/app/models/user';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { getApps, initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userAPI = environment.apiUrl + '/users';

  private db;

  constructor() {
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
    this.db = getFirestore();
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
