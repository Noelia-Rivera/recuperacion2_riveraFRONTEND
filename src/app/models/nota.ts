import { Alumno } from "./alumno";
import { Curso } from "./curso";

export class Nota {
    id: number;
    nota_1: number;
    nota_2: number;
    nota_3: number;
    promedio:number;
    alumno: Alumno;
    curso:Curso;
    
    constructor(id: number, nota_1: number, nota_2: number, nota_3: number, promedio: number, alumno: Alumno, curso: Curso) {
        this.id = id;
        this.nota_1 = nota_1;
        this.nota_2 = nota_2;
        this.nota_3 = nota_3;
        this.promedio = promedio;
        this.alumno = alumno;
        this.curso = curso;
    }
}

