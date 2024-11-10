import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Nota } from '../models/nota';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private apiUrl="http://localhost:8080/api/notas"
  constructor(private http: HttpClient) { }

  getNotas():Observable<Nota[]>{
    return this.http.get<Nota[]>(this.apiUrl);
  }
  getNotasById(id:number):Observable<Nota>{
    return this.http.get<Nota>(`${this.apiUrl}/${id}`);
  }
  crearNota(acceso: Nota):Observable<Nota>{
    return this.http.post<Nota>(this.apiUrl,acceso);
  }
  editarNota(acceso: Nota):Observable<Nota>{
    return this.http.post<Nota>(this.apiUrl,acceso);
  }
  deleteNota(id: number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
