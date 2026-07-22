import { Denuncia } from '../models/denuncia';
import { esperar } from '../utils/esperar';

export class DenunciaService {
  private denuncias: Denuncia[] = [];
  private ultimoId = 0;

  async crearDenuncia(denuncia: Omit<Denuncia, 'id_denuncia' | 'fecha_creacion'>): Promise<number> {
    await esperar(800);
    
    this.ultimoId++;
    const nuevaDenuncia: Denuncia = {
      id_denuncia: this.ultimoId,
      fecha_creacion: new Date(),
      ...denuncia
    };

    this.denuncias.push(nuevaDenuncia);
    return nuevaDenuncia.id_denuncia!;
  }

  async listarDenuncias(): Promise<Denuncia[]> {
    await esperar(500);
    return [...this.denuncias];
  }
}