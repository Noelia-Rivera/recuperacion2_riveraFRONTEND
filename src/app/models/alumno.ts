export class Alumno {
    id: number;
    nombres: string;
    apellidos: string;
    dni: string;

    constructor(id: number, nombres: string, apellidos: string, dni: string) {
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.dni = dni;
    }
}
