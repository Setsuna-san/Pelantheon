import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class LocalisationService {

  readonly LocateAPI = environment.apiUrl + '/locations';

  constructor(private http: HttpClient) {}

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.LocateAPI);
    console.log(this.LocateAPI)
  }

  getLocation(id: number): Observable<Location> {
    return this.http.get<Location>(this.LocateAPI + '/' + id);
  }

  addLocation(nouvelleRoutine: Location): Observable<Location> {
    return this.http.post<Location>(this.LocateAPI, nouvelleRoutine);
  }

  updateLocation(Location: Location): Observable<Location> {
    return this.http.put<Location>(this.LocateAPI + '/' + Location.id, Location);
  }

  deleteLocation(Location: Location): Observable<Location> {
    return this.http.delete<Location>(this.LocateAPI + '/' + Location.id);
  }
}
