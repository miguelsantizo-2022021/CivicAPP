import { Ciudadano } from '../models/ciudadano';
import { esperar } from '../utils/esperar';
import * as fs from 'fs';
import * as path from 'path';

export class CiudadanoService {
  private filePath = path.join(__dirname, '../data/ciudadanos.json');
  private ciudadanos: Ciudadano[] = [];
  private ultimoId = 0;

  constructor() {
    this.cargarDatos();
  }

  private cargarDatos() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const contenido = fs.readFileSync(this.filePath, 'utf-8');
        this.ciudadanos = JSON.parse(contenido);
        if (this.ciudadanos.length > 0) {
          this.ultimoId = Math.max(...this.ciudadanos.map(c => c.id_ciudadano || 0));
        }
      } else {
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
      }
    } catch (error) {
      this.ciudadanos = [];
    }
  }

  private guardarEnDisco() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.ciudadanos, null, 2));
  }

  async registrarCiudadano(ciudadano: Omit<Ciudadano, 'id_ciudadano'>): Promise<number> {
    await esperar(700);
    this.ultimoId++;

    const nuevoCiudadano: Ciudadano = {
      id_ciudadano: this.ultimoId,
      ...ciudadano
    };

    this.ciudadanos.push(nuevoCiudadano);
    this.guardarEnDisco();
    return nuevoCiudadano.id_ciudadano!;
  }

  async obtenerCiudadanoPorId(id: number): Promise<Ciudadano | null> {
    await esperar(300);
    const ciudadano = this.ciudadanos.find(c => c.id_ciudadano === id);
    return ciudadano || null;
  }
}