import { Denuncia } from '../models/denuncia';
import { esperar } from '../utils/esperar';
import * as fs from 'fs';
import * as path from 'path';

export class DenunciaService {
  private filePath = path.join(__dirname, '../data/denuncias.json');
  private denuncias: Denuncia[] = [];
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
        this.denuncias = JSON.parse(contenido);
        if (this.denuncias.length > 0) {
          this.ultimoId = Math.max(...this.denuncias.map(d => d.id_denuncia || 0));
        }
      } else {
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
      }
    } catch (error) {
      this.denuncias = [];
    }
  }

  private guardarEnDisco() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.denuncias, null, 2));
  }

  async crearDenuncia(denuncia: Omit<Denuncia, 'id_denuncia' | 'fecha_creacion'>): Promise<number> {
    await esperar(800);
    this.ultimoId++;

    const nuevaDenuncia: Denuncia = {
      id_denuncia: this.ultimoId,
      fecha_creacion: new Date(),
      ...denuncia
    };

    this.denuncias.push(nuevaDenuncia);
    this.guardarEnDisco();
    return nuevaDenuncia.id_denuncia!;
  }

  async listarDenuncias(): Promise<Denuncia[]> {
    await esperar(500);
    return [...this.denuncias];
  }
}