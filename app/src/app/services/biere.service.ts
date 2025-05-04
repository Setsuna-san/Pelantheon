import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Biere, NoteBiere } from '../models/biere';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class BiereService {
  private readonly biereAPI = environment.apiUrl + '/bieres';
  private readonly noteAPI = environment.apiUrl + '/notes';
  private readonly userAPI = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}

  // BIERES CRUD
  getBieres(): Observable<Biere[]> {
    return this.http.get<Biere[]>(this.biereAPI);
  }

  getBiere(id: string): Observable<Biere> {
    return this.http.get<Biere>(`${this.biereAPI}/${id}`);
  }

  addBiere(biere: Biere): Observable<Biere> {
    return this.http.post<Biere>(this.biereAPI, biere);
  }

  updateBiere(biere: Biere): Observable<Biere> {
    return this.http.put<Biere>(`${this.biereAPI}/${biere.id}`, biere);
  }

  deleteBiere(id: number): Observable<void> {
    return this.http.delete<void>(`${this.biereAPI}/${id}`);
  }

  getNotes(): Observable<NoteBiere[]> {
    return this.http.get<NoteBiere[]>(`${this.noteAPI}/notes`);
  }

  // NOTES CRUD
  getNotesBiere(biereId: string): Observable<NoteBiere[]> {
    return this.http.get<NoteBiere[]>(`${this.biereAPI}/${biereId}/notes`);
  }

  addNote(note: NoteBiere): Observable<NoteBiere> {
    return this.http.post<NoteBiere>(this.noteAPI, note);
  }

  updateNote(note: NoteBiere): Observable<NoteBiere> {
    return this.http.put<NoteBiere>(`${this.noteAPI}/${note.id}`, note);
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.noteAPI}/${id}`);
  }

  // USERS CRUD
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userAPI);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.userAPI}/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.userAPI, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.userAPI}/${user.id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.userAPI}/${id}`);
  }
}
