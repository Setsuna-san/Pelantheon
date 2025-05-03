import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Biere, NoteBiere, TypeBiere } from '../models/biere';

@Injectable({
  providedIn: 'root',
})
export class BiereService {
  readonly biereAPI = environment.apiUrl + '/bieres';
  constructor(private http: HttpClient) {}

  // BIERES CRUD
  getBieres(): Observable<Biere[]> {
    return this.http.get<Biere[]>(this.biereAPI);
  }

  getBiere(id: number): Observable<Biere> {
    return this.http.get<Biere>(this.biereAPI + '/' + id);
  }

  addBiere(nouvelleBiere: Biere): Observable<Biere> {
    return this.http.post<Biere>(this.biereAPI, nouvelleBiere);
  }

  updateBiere(biere: Biere): Observable<Biere> {
    return this.http.put<Biere>(this.biereAPI + '/' + biere.id, biere);
  }

  deleteBiere(biere: Biere): Observable<Biere> {
    return this.http.delete<Biere>(this.biereAPI + '/' + biere.id);
  }

  // NOTES CRUD
  addNoteBiere(note: NoteBiere): Observable<NoteBiere> {
    return this.http.post<NoteBiere>(`${this.biereAPI}/notes`, note);
  }

  getNotesBiere(biereId: number): Observable<NoteBiere[]> {
    return this.http.get<NoteBiere[]>(`${this.biereAPI}/${biereId}/notes`);
  }

  // TYPES CRUD
  getTypesBiere(): Observable<TypeBiere[]> {
    return this.http.get<TypeBiere[]>(`${this.biereAPI}/types`);
  }
}
