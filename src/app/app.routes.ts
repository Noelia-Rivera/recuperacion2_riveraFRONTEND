import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { AlumnoComponent } from './componentes/alumno/alumno.component';
import { CursoComponent } from './componentes/curso/curso.component';
import { NotaComponent } from './componentes/nota/nota.component';

export const routes: Routes = [
    {
        path:'',
        component: HomeComponent,
        title: 'home'
    },
    {
        path:'alumno',
        component: AlumnoComponent,
        title: 'alumno'
    },
    {
        path:'curso',
        component: CursoComponent,
        title: 'curso'
    },
    {
        path:'nota',
        component: NotaComponent,
        title: 'nota'
    }
];
