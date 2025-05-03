import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pizza, Categorie, Boisson } from '../models/carte';

@Injectable({
  providedIn: 'root',
})
export class CarteService {
  readonly pizzaAPI = environment.apiUrl + '/pizzas';
  readonly categorieAPI = environment.apiUrl + '/categories';
  readonly boissonAPI = environment.apiUrl + '/boissons';

  constructor(private http: HttpClient) {}

  // PIZZAS CRUD
  getPizzas(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(this.pizzaAPI);
  }

  getPizza(id: number): Observable<Pizza> {
    return this.http.get<Pizza>(this.pizzaAPI + '/' + id);
  }

  addPizza(nouvellePizza: Pizza): Observable<Pizza> {
    return this.http.post<Pizza>(this.pizzaAPI, nouvellePizza);
  }

  updatePizza(pizza: Pizza): Observable<Pizza> {
    return this.http.put<Pizza>(this.pizzaAPI + '/' + pizza.id, pizza);
  }

  deletePizza(pizza: Pizza): Observable<Pizza> {
    return this.http.delete<Pizza>(this.pizzaAPI + '/' + pizza.id);
  }

  // CATEGORIES CRUD
  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.categorieAPI);
  }

  getCategorie(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(this.categorieAPI + '/' + id);
  }

  addCategorie(nouvelleCategorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(this.categorieAPI, nouvelleCategorie);
  }

  updateCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(
      this.categorieAPI + '/' + categorie.id,
      categorie
    );
  }

  deleteCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.delete<Categorie>(this.categorieAPI + '/' + categorie.id);
  }

  // BOISSONS CRUD
  getBoissons(): Observable<Boisson[]> {
    return this.http.get<Boisson[]>(this.boissonAPI);
  }

  getBoisson(id: number): Observable<Boisson> {
    return this.http.get<Boisson>(this.boissonAPI + '/' + id);
  }

  addBoisson(nouvelleBoisson: Boisson): Observable<Boisson> {
    return this.http.post<Boisson>(this.boissonAPI, nouvelleBoisson);
  }

  updateBoisson(boisson: Boisson): Observable<Boisson> {
    return this.http.put<Boisson>(this.boissonAPI + '/' + boisson.id, boisson);
  }

  deleteBoisson(boisson: Boisson): Observable<Boisson> {
    return this.http.delete<Boisson>(this.boissonAPI + '/' + boisson.id);
  }
}
