
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CitaAgenda } from './components/cita-agenda/cita-agenda';
import { CitaForm } from './components/cita-form/cita-form';

const routes: Routes = [
  {
    path: '',
    component: CitaAgenda
  },
  {
    path: 'nueva',
    component: CitaForm
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitasRoutingModule {}