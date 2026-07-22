export interface Denuncia {
  id_denuncia?: number;
  id_ciudadano: number;
  id_categoria: number; // 1-Baches, 2-Alumbrado/Electricidad, 3-Agua, 4-Ciudadano Problemático, 5-Basura
  id_estado: number;    // 1-Pendiente, 2-En proceso, 3-Resuelto
  titulo: string;       // Un título corto descriptivo
  descripcion: string;
  ciudad: string;       // Ej: Guatemala, Mixco, Villa Nueva
  zona: number;         // Ej: Zona 1, Zona 10, etc.
  direccion_exacta?: string; // Opcional: Calle
  latitud?: number;
  longitud?: number;
  fecha_creacion?: Date;
}