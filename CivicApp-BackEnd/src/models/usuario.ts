import { Institucion } from '../models/intitucion';

export interface Usuario {
  id_usuario?: number;
  correo: string;
  contrasenia: string;
  rol: 'ciudadano' | 'institucion' | 'admin';
}

export { Institucion };