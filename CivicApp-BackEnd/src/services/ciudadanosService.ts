import { Ciudadano } from '../models/ciudadano';

export class CiudadanoService {
  private ciudadanos: Ciudadano[] = [];
  private ultimoId = 0;

  // Registrar perfil simulando la llave foránea id_usuario
  async registrarCiudadano(ciudadano: Omit<Ciudadano, 'id_ciudadano'>): Promise<number> {
    this.ultimoId++;

    const nuevoCiudadano: Ciudadano = {
      id_ciudadano: this.ultimoId,
      ...ciudadano
    };

    this.ciudadanos.push(nuevoCiudadano);
    return nuevoCiudadano.id_ciudadano!;
  }

  // Buscar un ciudadano por su ID
  async obtenerCiudadanoPorId(id: number): Promise<Ciudadano | null> {
    const ciudadano = this.ciudadanos.find(c => c.id_ciudadano === id);
    return ciudadano || null;
  }
}