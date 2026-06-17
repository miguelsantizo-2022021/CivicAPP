export interface Notificacion {
  id_notificacion: number;
  id_usuario: number;
  mensaje_notificacion: string;
  leido: boolean;
  fecha_envio: Date;
}