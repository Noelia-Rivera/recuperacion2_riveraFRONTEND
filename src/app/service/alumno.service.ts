import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alumno } from '../models/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
    private apiUrl="http://localhost:8080/api/alumnos"
    constructor(private http: HttpClient) { }
  
    getAlumnos():Observable<Alumno[]>{
      return this.http.get<Alumno[]>(this.apiUrl);
    }
    getAlumnosById(id:number):Observable<Alumno>{
      return this.http.get<Alumno>(`${this.apiUrl}/${id}`);
    }
    crearAlumnos(alumno: Alumno):Observable<Alumno>{
      return this.http.post<Alumno>(this.apiUrl,alumno);
    }
    editarAlumnos(alumno: Alumno):Observable<Alumno>{
      return this.http.post<Alumno>(this.apiUrl,alumno);
    }
    deleteAlumnos(id: number){
      return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
