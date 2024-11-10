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
import { Curso } from '../../models/curso';
import { CursoService } from '../../service/curso.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [SidebarComponent, TableModule, CommonModule, DialogModule, ButtonModule, InputTextModule, FormsModule, ConfirmDialogModule, ToastModule, DropdownModule],
  templateUrl: './curso.component.html',
  styleUrl: './curso.component.css'
})
export class CursoComponent {
  cursos: Curso[] = [];
  curso: Curso = new Curso(0, '');
  titulo: string = '';
  opc: string = '';
  op = 0;
  visible: boolean = false;
  isDeleteInProgress: boolean = false;

  constructor(
    private cursoService: CursoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarCurso();
  }

  showDialogCreate() {
    this.titulo = 'Añadir nuevo curso';
    this.opc = 'Guardar';
    this.op = 0;
    this.visible = true;
  }

  limpiar() {
    this.titulo = '';
    this.opc = '';
    this.op = 0;
    this.curso.id = 0;
    this.curso.nombre = '';
  }

  opcion(): void {
    if (this.op == 0) {
      this.addCategoria();
      this.limpiar();
    } else if (this.op == 1) {
      this.editCurso();
      this.limpiar();
    } else {
      this.limpiar();
    }
  }

  listarCurso() {
    this.cursoService.getCurso().subscribe((data: Curso[]) => {
      this.cursos = data;
    });
  }

  addCategoria(): void {
    this.cursoService.crearCurso(this.curso).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Curso registrado con éxito',
        });
        this.listarCurso();
        this.op = 0;
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el curso',
        });
      },
    });
    this.visible = false;
  }

  editCurso() {
    this.curso.id = Number(this.cursos.find(f => f.id === this.curso.id)?.id || 0);
    this.cursoService.editarCurso(this.curso).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Curso editado con éxito',
        });
        this.visible = false;
        this.listarCurso();
        this.op = 0;
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo editar el curso',
        });
      },
    });
  }

  deleteCurso(id: any) {
    Swal.fire({
      title: "¿Estás seguro de borrar este curso?",
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
        this.cursoService.deleteCurso(id).subscribe(resp=>{this.listarCurso();});
      }
    });
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar curso';
    this.opc = 'Actualizar';
    this.cursoService.getCursoById(id).subscribe((data) => {
      this.curso = data;
      this.op = 1;
    });
    this.visible = true;
  }

  showDialogDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Quieres eliminar este curso?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.deleteCurso(id);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rechazado',
          detail: 'Operación cancelada',
        });
      },
    });
  }
}
