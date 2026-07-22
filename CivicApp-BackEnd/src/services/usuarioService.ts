import { Usuario } from '../models/usuario';
import { esperar } from '../utils/esperar';

export class UsuarioService {
  private usuarios: Usuario[] = [];
  private ultimoId = 0;

  async crearUsuario(usuario: Omit<Usuario, 'id_usuario'>): Promise<number> {
    await esperar(600);
    
    this.ultimoId++;
    const nuevoUsuario: Usuario = {
      id_usuario: this.ultimoId,
      ...usuario
    };

    this.usuarios.push(nuevoUsuario);
    return nuevoUsuario.id_usuario!;
  }

  async obtenerUsuarios(): Promise<Usuario[]> {
    await esperar(400);
    return [...this.usuarios];
  }
}
