import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, User } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isLoggedIn: boolean = false;
  private expirationTime = 30 * 60 * 1000; // Durée de session de 30 minutes (en millisecondes)

  constructor() {
    this.checkSession();
  }

  getUsername(): string {
    return sessionStorage.getItem('username') || ''; // Récupère le nom d'utilisateur depuis la session
  }

  // Simuler la connexion d'un utilisateur
  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'autru') {
      this.isLoggedIn = true;
      const expirationDate = new Date().getTime() + this.expirationTime; // Calculer la date d'expiration
      sessionStorage.setItem('isLoggedIn', 'true');  // Enregistrer l'état de connexion
      sessionStorage.setItem('expirationDate', expirationDate.toString());  // Enregistrer la date d'expiration
      sessionStorage.setItem('username', username);  // Enregistrer le nom d'utilisateur
      return true;
    }
    return false;
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    this.isLoggedIn = false;
    sessionStorage.removeItem('isLoggedIn');  // Supprimer l'état de la session
    sessionStorage.removeItem('expirationDate');  // Supprimer la date d'expiration
    sessionStorage.removeItem('username');  // Supprimer le nom d'utilisateur
  }

  // Vérification si l'utilisateur est connecté
  isAuthenticated(): boolean {
    this.checkSession();
    return this.isLoggedIn;
  }

  // Vérifie si la session est encore valide
  private checkSession(): void {
    const expirationDate = sessionStorage.getItem('expirationDate');
    if (expirationDate) {
      const now = new Date().getTime();
      if (now > +expirationDate) {
        // La session a expiré
        this.logout();
      } else {
        this.isLoggedIn = true; // La session est encore valide
      }
    }
  }
}
