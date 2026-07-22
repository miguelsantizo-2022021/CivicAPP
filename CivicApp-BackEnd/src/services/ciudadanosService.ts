import { Ciudadano } from '../models/ciudadano';
import { esperar } from '../utils/esperar';

export class CiudadanoService {
  private ciudadanos: Ciudadano[] = [];
  private ultimoId = 0;

  async registrarCiudadano(ciudadano: Omit<Ciudadano, 'id_ciudadano'>): Promise<number> {
    await esperar(700);
    
    this.ultimoId++;
    const nuevoCiudadano: Ciudadano = {
      id_ciudadano: this.ultimoId,
      ...ciudadano
    };

    this.ciudadanos.push(nuevoCiudadano);
    return nuevoCiudadano.id_ciudadano!;
  }

  async obtenerCiudadanoPorId(id: number): Promise<Ciudadano | null> {
    await esperar(300);
    const ciudadano = this.ciudadanos.find(c => c.id_ciudadano === id);
    return ciudadano || null;
  }
}