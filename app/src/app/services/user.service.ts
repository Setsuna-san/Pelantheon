import { Injectable } from '@angular/core';
import { from, map, Observable, switchMap } from 'rxjs';
import { environment, firebaseConfig } from 'src/environments/environment';

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

  qrcodeConnexion(tryToken: string): Observable<boolean> {
    const wxcv = doc(this.db, 'config', 'token'); // Document "token"

    return from(getDoc(wxcv)).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) {
          throw new Error('Document token non trouvé');
        }
        const data = docSnap.data();
        const valeurOui = data?.['oui'];
        return valeurOui === tryToken; // retourne true si correct, false sinon
      })
    );
  }

  identifyUser(): Observable<boolean> {
    const localToken = localStorage.getItem('IdToken') || '';
    const docRef = doc(
      this.db,
      'config',
      'b4c7d4f11a075d426895e5580b88dca6b30741683b80579adb6f79314377b382'
    );

    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) {
          throw new Error('Document token non trouvé');
        }
        const data = docSnap.data();
        const firestoreToken =
          data?.[
            '7b147f38deb4a9066197dd19b3d0aebe58b2ed5dda2ee8b08e30172937f3b498'
          ] || '';

        console.log('Comparing tokens:', { firestoreToken, localToken });
        return firestoreToken === localToken;
      })
    );
  }

  saveFirestoreTokenToLocalStorage(): void {
    console.log('Saving Firestore token to localStorage');
    const docRef = doc(
      this.db,
      'config',
      'b4c7d4f11a075d426895e5580b88dca6b30741683b80579adb6f79314377b382'
    );
    console.log('Document reference:', docRef);

    from(getDoc(docRef))
      .pipe(
        map((docSnap) => {
          if (!docSnap.exists()) {
            console.log('Document token non trouvé');
            throw new Error('Document token non trouvé');
          }
          console.log('Document data:', docSnap.data());
          const data = docSnap.data();
          const firestoreToken =
            data?.[
              '7b147f38deb4a9066197dd19b3d0aebe58b2ed5dda2ee8b08e30172937f3b498'
            ] || '';

          localStorage.setItem('IdToken', firestoreToken); // Enregistre dans localStorage
        })
      )
      .subscribe({
        // 🔥 Sans subscribe, le Observable n'est jamais exécuté
        next: () => console.log('Token enregistré dans localStorage ✅'),
        error: (err) => console.error('Erreur:', err),
      });
  }

  indexUsersById(users: User[]): { [id: string]: User } {
    return users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as { [id: string]: User });
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
