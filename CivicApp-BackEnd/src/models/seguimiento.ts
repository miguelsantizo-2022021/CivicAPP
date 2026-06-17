export interface Seguimiento {
  id_seguimiento?: number;
  id_denuncia: number;
  id_estado_anterior?: number;
  id_estado_nuevo: number;
  fecha_cambio?: Date;
}