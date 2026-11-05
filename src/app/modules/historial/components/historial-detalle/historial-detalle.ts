import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../core/services/storage';
import { Mascota } from '../../../../core/models/mascota.model';
import { Dueno } from '../../../../core/models/dueno.model';
import { ICita } from '../../../../core/models/cita.model';

@Component({
  selector: 'app-historial-detalle',
  standalone: false,
  templateUrl: './historial-detalle.html',
  styleUrl: './historial-detalle.css'
})
export class HistorialDetalle implements OnInit {
  mascotas: Mascota[] = [];
  mascotaSeleccionadaId: string = '';
  
  mascotaActual: Mascota | null = null;
  duenoActual: Dueno | null = null;
  citasMascota: ICita[] = [];

  veterinarios = [
    { id: 'V-1', nombre: 'Dr. Carlos Mendoza' },
    { id: 'V-2', nombre: 'Dra. Ana Torres' },
    { id: 'V-3', nombre: 'Dr. Luis Ramírez' }
  ];

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.mascotas = this.storageService.getMascotas();
    if (this.mascotas.length > 0) {
      this.seleccionarMascota(this.mascotas[this.mascotas.length - 1].id);
    }
  }

  onMascotaChange(): void {
    this.seleccionarMascota(this.mascotaSeleccionadaId);
  }

  seleccionarMascota(id: string): void {
    this.mascotaSeleccionadaId = id;
    this.mascotaActual = this.mascotas.find(m => m.id === id) || null;

    if (this.mascotaActual) {
      const duenos = this.storageService.getDuenos();
      // Buscar por duenoId exacto o coincidencia parcial en registros antiguos
      this.duenoActual = duenos.find(d => d.id === this.mascotaActual?.duenoId) || null;

      const todasLasCitas = this.storageService.getCitas();
      this.citasMascota = todasLasCitas.filter(c => c.mascotaId === this.mascotaActual?.id);
    }
  }

  obtenerNombreVeterinario(veterinarioId?: string): string {
    if (!veterinarioId) return 'Dr. Carlos Mendoza'; // Valor por defecto si no se asignó en la cita
    const vet = this.veterinarios.find(v => v.id === veterinarioId);
    return vet ? vet.nombre : 'Dr. Atendiente';
  }
}