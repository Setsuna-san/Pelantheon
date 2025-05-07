import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Biere, NoteBiere } from 'src/app/models/biere';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userAPI = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}
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
