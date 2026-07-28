export interface Denuncia {
  id_denuncia?: number;
  id_ciudadano: number;
  id_categoria: number;
  id_estado?: number;
  descripcion: string;
  zona: number;
  calle: string;
  fecha_creacion?: Date;
}