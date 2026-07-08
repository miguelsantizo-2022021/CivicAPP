import { Denuncia } from '../models/denuncia';

export class DenunciaService {
  private denuncias: Denuncia[] = [];
  private ultimoId = 0;

  // Crear un reporte
  async crearDenuncia(denuncia: Omit<Denuncia, 'id_denuncia' | 'fecha_creacion'>): Promise<number> {
    this.ultimoId++;

    const nuevaDenuncia: Denuncia = {
      id_denuncia: this.ultimoId,
      fecha_creacion: new Date(), 
      ...denuncia
    };

    this.denuncias.push(nuevaDenuncia);
    return nuevaDenuncia.id_denuncia!;
  }

  // Listar reportes
  async listarDenuncias(): Promise<Denuncia[]> {
    return [...this.denuncias];
  }
}