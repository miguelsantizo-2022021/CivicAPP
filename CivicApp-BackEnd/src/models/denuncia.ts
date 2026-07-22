import { ComentarioSeguimiento } from '../models/ComentarioSeguimiento';

export interface Denuncia {
  id_denuncia?: number;
  fecha_creacion: Date | string;
  id_ciudadano: number;
  id_categoria: number;
  id_estado: number; 
  titulo: string;
  descripcion: string;
  ciudad: string;
  zona: number;
  direccion_exacta?: string;
  comentarios?: ComentarioSeguimiento[]; 
}