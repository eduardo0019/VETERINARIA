import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared-module';
import { CitasRoutingModule } from './citas-routing-module';
import { CitaAgenda } from './components/cita-agenda/cita-agenda';
import { CitaForm } from './components/cita-form/cita-form';

@NgModule({
  declarations: [CitaAgenda, CitaForm],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CitasRoutingModule
  ],
})
export class CitasModule {}