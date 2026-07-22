import { Usuario } from '../models/usuario';
import { esperar } from '../utils/esperar';
import * as fs from 'fs';
import * as path from 'path';

export class UsuarioService {
  private filePath = path.join(__dirname, '../data/usuarios.json');
  private usuarios: Usuario[] = [];
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
        this.usuarios = JSON.parse(contenido);
        if (this.usuarios.length > 0) {
          this.ultimoId = Math.max(...this.usuarios.map(u => u.id_usuario || 0));
        }
      } else {
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
      }
    } catch (error) {
      this.usuarios = [];
    }
  }

  private guardarEnDisco() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.usuarios, null, 2));
  }

  async crearUsuario(usuario: Omit<Usuario, 'id_usuario'>): Promise<number> {
    await esperar(600);
    this.ultimoId++;

    const nuevoUsuario: Usuario = {
      id_usuario: this.ultimoId,
      ...usuario
    };

    this.usuarios.push(nuevoUsuario);
    this.guardarEnDisco();
    return nuevoUsuario.id_usuario!;
  }

  async obtenerUsuarios(): Promise<Usuario[]> {
    await esperar(400);
    return [...this.usuarios];
  }
}