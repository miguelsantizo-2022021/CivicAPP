export interface Denuncia {
  id_denuncia?: number;
  id_ciudadano: number;
  id_categoria: number;
  id_estado: number;
  descripcion: string;
  latitud: number;
  longitud: number;
  fecha_creacion?: Date;
}