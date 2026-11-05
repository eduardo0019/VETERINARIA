
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { StorageService } from '../../../../core/services/storage';
import { Mascota } from '../../../../core/models/mascota.model';
import { ICita, PrioridadCita } from '../../../../core/models/cita.model';

@Component({
  selector: 'app-cita-form',
  standalone: false,
  styleUrl: './cita-form.css',
  templateUrl: './cita-form.html',
})
export class CitaForm {
  mascotas: Mascota[] = [];
  mensaje = '';
  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      mascotaId: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      motivo: ['', Validators.required],
      prioridad: ['ESTABLE' as PrioridadCita, Validators.required]
    });

    this.mascotas = this.storage.getMascotas();
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensaje = 'Completa todos los campos obligatorios.';
      return;
    }

    const datos = this.formulario.getRawValue();

    const mascota = this.mascotas.find(
      m => m.id === datos.mascotaId
    );

    if (!mascota) {
      this.mensaje = 'Selecciona una mascota válida.';
      return;
    }

    const cita: ICita = {
      id: 'C-' + Date.now(),
      mascotaId: mascota.id,
      duenoId: mascota.duenoId,
      fechaHora: new Date(datos.fecha + 'T' + datos.hora),
      motivo: datos.motivo.trim(),
      prioridad: datos.prioridad,
      estado: 'PROGRAMADA'
    };

    this.storage.guardarCita(cita);

    this.formulario.reset({
      mascotaId: '',
      fecha: '',
      hora: '',
      motivo: '',
      prioridad: 'ESTABLE'
    });

    this.router.navigate(['/citas']);
  }

  cancelar(): void {
    this.router.navigate(['/citas']);
  }
}