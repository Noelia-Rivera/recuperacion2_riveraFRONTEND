import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotaService } from '../../service/nota.service';
import { MessageService } from 'primeng/api';
import { AlumnoService } from '../../service/alumno.service';
import { CursoService } from '../../service/curso.service';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { NgForOf, NgIf } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Nota } from '../../models/nota';
import { Alumno } from '../../models/alumno';
import { Curso } from '../../models/curso';

@Component({
  selector: 'app-nota',
  standalone: true,
  imports: [SidebarComponent ,TableModule,ButtonModule,ButtonGroupModule,DialogModule,InputTextModule,ReactiveFormsModule,NgIf,NgForOf,FormsModule],
  templateUrl: './nota.component.html',
  styleUrl: './nota.component.css'
})
export class NotaComponent {
  notas:Nota[] = [];
  alumnos:Alumno[] = [];
  cursos:Curso[]=[];
  visible: boolean = false;
  formNota:FormGroup = new FormGroup({});
  isUpdate:boolean = false;

  constructor(
    private notaService:NotaService,
    private messageService:MessageService,
    private alumnoService:AlumnoService,
    private cursoService:CursoService
  ){}

  calcularPromedio() {
    const nota1 = parseFloat(this.formNota.get('nota_1')?.value) || 0;
    const nota2 = parseFloat(this.formNota.get('nota_2')?.value) || 0;
    const nota3 = parseFloat(this.formNota.get('nota_3')?.value) || 0;
    
    const promedio = (nota1 + nota2 + nota3) / 3;
    this.formNota.get('promedio')?.setValue(promedio.toFixed(2));
  }
  

  ngOnInit(): void {
    this.listarAlumnos();
    this.listarCursos();
    this.listarNotas();

    this.formNota = new FormGroup({
      id: new FormControl(''),
      nota_1: new FormControl('', [Validators.required, Validators.min(0), Validators.max(20)]),
      nota_2: new FormControl('', [Validators.required, Validators.min(0), Validators.max(20)]),
      nota_3: new FormControl('', [Validators.required, Validators.min(0), Validators.max(20)]),
      promedio: new FormControl({ value: '', disabled: true }), 
      idAlumno: new FormControl('', Validators.required),
      idCurso: new FormControl('', Validators.required),
    });

    this.formNota.get('nota_1')?.valueChanges.subscribe(() => this.calcularPromedio());
    this.formNota.get('nota_2')?.valueChanges.subscribe(() => this.calcularPromedio());
    this.formNota.get('nota_3')?.valueChanges.subscribe(() => this.calcularPromedio());
  }

  listarNotas(){
    this.notaService.getNotas().subscribe((data)=>{
      this.notas=data;
      console.log(this.notas);
    });
  }
  listarAlumnos(){
    this.alumnoService.getAlumnos().subscribe((data)=>{
      this.alumnos=data;
      console.log(this.alumnos);
    });
  }
  listarCursos(){
    this.cursoService.getCurso().subscribe((data)=>{
      this.cursos=data;
      console.log(this.cursos);
    });
  }

  showDialog() {
    this.formNota.reset();
    this.visible = true;
    this.isUpdate=false;
}

  resetFormProducto(){
    this.formNota.reset();
  }

  selectNota(nota: Nota) {
    this.isUpdate = true;
    this.visible = true;
    this.formNota.patchValue({
      id: nota.id,
      nota_1: nota.nota_1,
      nota_2: nota.nota_2,
      nota_3: nota.nota_3,
      promedio: nota.promedio,
      idAlumno: nota.alumno.id,
      idCurso: nota.curso.id
    });
    this.calcularPromedio(); 
  }

  addNota() {
    const nuevaNota = {
      id: this.formNota.value.id,
      nota_1: this.formNota.value.nota_1,
      nota_2: this.formNota.value.nota_2,
      nota_3: this.formNota.value.nota_3,
      promedio: this.formNota.get('promedio')?.value,
      alumno: { id: this.formNota.value.idAlumno } as any,
      curso: { id: this.formNota.value.idCurso } as any,
    } as Nota;

    this.notaService.crearNota(nuevaNota).subscribe({
      next: (resp) => {
        if (resp) {
          Swal.fire({
            icon: 'success',
            title: 'Nota creada',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          this.listarNotas();
          this.formNota.reset();
          this.visible = false;
        }
      },
      error: (err) => {
        console.error('Error creando la nota', err);
      }
    });
  }

  editNota() {
    const notaActualizada = {
      id: this.formNota.value.id,
      nota_1: this.formNota.value.nota_1,
      nota_2: this.formNota.value.nota_2,
      nota_3: this.formNota.value.nota_3,
      promedio: this.formNota.get('promedio')?.value,
      alumno: { id: this.formNota.value.idAlumno } as any,
      curso: { id: this.formNota.value.idCurso } as any,
    } as Nota;

    this.notaService.editarNota(notaActualizada).subscribe({
      next: (resp) => {
        if (resp) {
          Swal.fire({
            icon: 'success',
            title: 'Nota actualizada',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          this.listarNotas();
          this.formNota.reset();
          this.visible = false;
        }
      },
      error: (err) => {
        console.error('Error actualizando la nota', err);
      }
    });
  }

  deleteNota(id: any){
    Swal.fire({
      title: "¿Estás seguro de borrar esta nota?",
      text: "¡No serás capaz de reveritrlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#19e212",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borralo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Borrado!",
          text: "El dato ha sido borrado",
          icon: "success"
        });
        this.notaService.deleteNota(id).subscribe(resp=>{this.listarNotas();});
      }
    });
  }
}
