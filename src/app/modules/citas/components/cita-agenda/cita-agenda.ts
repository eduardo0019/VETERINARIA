
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StorageService } from '../../../../core/services/storage';
import { ICita, EstadoCita } from '../../../../core/models/cita.model';
import { Mascota } from '../../../../core/models/mascota.model';

@Component({
  selector: 'app-cita-agenda',
  standalone: false,
  styleUrl: './cita-agenda.css',
  templateUrl: './cita-agenda.html',
})
export class CitaAgenda implements OnInit {
  @Input() citas: ICita[] = [];
  @Output() citaActualizada = new EventEmitter<ICita>();

  mascotas: Mascota[] = [];

  veterinarios = [
    { id: 'V-1', nombre: 'Dr. Carlos Mendoza' },
    { id: 'V-2', nombre: 'Dra. Ana Torres' },
    { id: 'V-3', nombre: 'Dr. Luis Ramírez' }
  ];

  citaSeleccionadaId: string | null = null;
  veterinarioSeleccionadoId = '';

  citaParaCompletarId: string | null = null;

  diagnostico = '';
  detalleAtencion = '';
  receta = '';

  mensaje = '';

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.mascotas = this.storage.getMascotas();

    if (this.citas.length === 0) {
      this.cargarCitas();
    }
  }

  cargarCitas(): void {
    this.citas = this.storage.getCitas();
  }

  nombreMascota(mascotaId: string): string {
    const mascota = this.mascotas.find(m => m.id === mascotaId);
    return mascota ? mascota.nombre : 'Mascota no encontrada';
  }

  nombreVeterinario(veterinarioId?: string): string {
    const veterinario = this.veterinarios.find(
      v => v.id === veterinarioId
    );

    return veterinario ? veterinario.nombre : 'Sin asignar';
  }

  seleccionarVeterinario(cita: ICita): void {
    this.citaSeleccionadaId = cita.id;
    this.veterinarioSeleccionadoId = '';
  }

  confirmarAtencion(cita: ICita): void {
    if (!this.veterinarioSeleccionadoId) {
      return;
    }

    cita.veterinarioId = this.veterinarioSeleccionadoId;

    this.storage.actualizarEstadoCita(
      cita.id,
      'EN_ATENCION',
      this.veterinarioSeleccionadoId
    );

    cita.estado = 'EN_ATENCION';

    this.citaActualizada.emit(cita);

    this.cancelarSeleccion();
    this.cargarCitas();
  }

  cancelarSeleccion(): void {
    this.citaSeleccionadaId = null;
    this.veterinarioSeleccionadoId = '';
  }

  abrirFormularioAtencion(cita: ICita): void {
    this.citaParaCompletarId = cita.id;

    this.diagnostico = cita.diagnostico || '';
    this.detalleAtencion = cita.detalleAtencion || '';
    this.receta = cita.receta || '';

    this.mensaje = '';
  }

  guardarAtencion(cita: ICita): void {
    if (
      !this.diagnostico.trim() ||
      !this.detalleAtencion.trim() ||
      !this.receta.trim()
    ) {
      this.mensaje = 'Completa el diagnóstico, detalle y receta.';
      return;
    }

    this.storage.actualizarEstadoCita(
      cita.id,
      'COMPLETADA',
      cita.veterinarioId,
      {
        diagnostico: this.diagnostico.trim(),
        detalleAtencion: this.detalleAtencion.trim(),
        receta: this.receta.trim()
      }
    );

    cita.estado = 'COMPLETADA';
    cita.diagnostico = this.diagnostico.trim();
    cita.detalleAtencion = this.detalleAtencion.trim();
    cita.receta = this.receta.trim();

    this.citaActualizada.emit(cita);

    this.citaParaCompletarId = null;
    this.mensaje = 'Atención médica guardada correctamente.';

    this.cargarCitas();
  }

  cancelarFormularioAtencion(): void {
    this.citaParaCompletarId = null;
    this.diagnostico = '';
    this.detalleAtencion = '';
    this.receta = '';
    this.mensaje = '';
  }

  cambiarEstado(cita: ICita, estado: EstadoCita): void {
    this.storage.actualizarEstadoCita(cita.id, estado);
    cita.estado = estado;

    this.citaActualizada.emit(cita);

    this.cargarCitas();
  }
}