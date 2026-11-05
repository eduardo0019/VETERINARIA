export type EspecieMascota = 'Perro' | 'Gato' | 'Ave' | 'Otro' | string;

export interface IMascota {
  id: string;
  nombre: string;
  especie: EspecieMascota;
  raza: string;
  peso?: number;
  fechaNacimiento: Date;
  duenoId: string;
  calcularEdad(): number;
}

export class Mascota implements IMascota {
  public peso?: number;

  constructor(
    public id: string,
    public nombre: string,
    public especie: EspecieMascota,
    public raza: string,
    public fechaNacimiento: Date,
    public duenoId: string,
    peso?: number
  ) {
    this.peso = peso;
  }

  public calcularEdad(): number {
    const diff = Date.now() - new Date(this.fechaNacimiento).getTime();
    const diffDate = new Date(diff);
    return Math.abs(diffDate.getUTCFullYear() - 1970);
  }
}