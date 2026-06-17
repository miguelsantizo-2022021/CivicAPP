export interface Comentario {
  id_comentario?: number;
  id_denuncia: number;
  id_usuario: number;
  texto_comentario: string;
  fecha_comentario?: Date;
}