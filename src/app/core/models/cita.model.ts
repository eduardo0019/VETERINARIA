export type EstadoCita =
  | 'PROGRAMADA'
  | 'EN_ATENCION'
  | 'COMPLETADA'
  | 'CANCELADA';

export type PrioridadCita =
  | 'ESTABLE'
  | 'URGENCIA'
  | 'EMERGENCIA';

export interface ICita {
  id: string;
  mascotaId: string;
  duenoId: string;
  fechaHora: Date;
  motivo: string;
  estado: EstadoCita;
  prioridad: PrioridadCita;

  veterinarioId?: string;
  veterinarioNombre?: string;
  diagnostico?: string;
  detalleAtencion?: string;
  receta?: string;
}

export class Cita implements ICita {
  constructor(
    public id: string,
    public mascotaId: string,
    public duenoId: string,
    public fechaHora: Date,
    public motivo: string,
    public estado: EstadoCita = 'PROGRAMADA',
    public prioridad: PrioridadCita = 'ESTABLE',
    public veterinarioId?: string,
    public veterinarioNombre?: string,
    public diagnostico?: string,
    public detalleAtencion?: string,
    public receta?: string
  ) {}
}