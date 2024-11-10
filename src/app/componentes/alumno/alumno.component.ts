import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { Alumno } from '../../models/alumno';
import { AlumnoService } from '../../service/alumno.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [SidebarComponent, SidebarComponent,TableModule, CommonModule, DialogModule, ButtonModule, InputTextModule, FormsModule, ConfirmDialogModule, ToastModule, DropdownModule],
  templateUrl: './alumno.component.html',
  styleUrl: './alumno.component.css'
})
export class AlumnoComponent {
  alumnos: Alumno[]=[];
  alumno: Alumno= new Alumno(0, '', '', '');
  titulo: string= '';
  opc: string= '';
  op= 0;
  visible: boolean= false;
  isDeleteInProgress: boolean= false;

  constructor(private alumnoService: AlumnoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService){}

  ngOnInit(): void {
    this.listarAlumnos();
  }

  showDialogCreate(){
    this.titulo= "Añadir nuevo alumno"
    this.opc= "Guardar";
    this.op= 0;
    this.visible= true;
  }

  limpiar(){
    this.titulo= '';
    this.opc= '';
    this.op= 0;
    this.alumno.id= 0;
    this.alumno.nombres= '';
    this.alumno.apellidos= '';
    this.alumno.dni= '';
  }

  opcion(): void{
    if (this.op==0) {
      this.addAlumno();
      this.limpiar();
    } else if (this.op==1) {
      console.log("Editar");
      this.editAlumno();
      this.limpiar();
    } else {
      console.log("Vacio");
      this.limpiar();
    }
  }  
  
  listarAlumnos(){
    this.alumnoService.getAlumnos().subscribe(
      (data: Alumno[]) => {
        this.alumnos = data;
      });
  }

  addAlumno():void{
    this.alumnoService.crearAlumnos(this.alumno).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'alumno registrada con exito',
        });
        this.listarAlumnos();
        this.op= 0;
      },
      error: () => {
        this.isDeleteInProgress= false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: "No se puedo registrar alumno",
        });
      },
    });
    this.visible= false;
  }

  editAlumno() {
    this.alumno.id = Number(this.alumnos.find(f => f.id === this.alumno.id)?.id || 0);
    this.alumnoService.editarAlumnos(this.alumno).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'alumno editada con exito',
        });
        this.visible = false;
        this.listarAlumnos();
        this.op = 0;
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo editar alumno',
        });
      },
    });
  }

  deleteAlumno(id: any){
    Swal.fire({
      title: "¿Estás seguro de borrar este alumno?",
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
        this.alumnoService.deleteAlumnos(id).subscribe(resp=>{this.listarAlumnos();});
      }
    });
  }
  
  showDialogEdit(id: number){
    this.titulo= "Editar Categoria"
    this.opc= "Actualizar";
    this.alumnoService.getAlumnosById(id).subscribe((data)=>{
      this.alumno= data;
      this.op= 1;
    });
    this.visible= true;
  }

  showDialogDelete(event: Event, id: number){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Quieres eliminar este alumno?',
      header: 'Confirmacion de Eliminacion',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",
  
      accept: () => {
          this.deleteAlumno(id);
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Operacion cancelada' });
      }
    });
  }
}
