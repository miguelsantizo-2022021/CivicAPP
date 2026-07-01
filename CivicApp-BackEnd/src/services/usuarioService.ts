import { Usuario } from '../models/usuario';

export class UsuarioService {
  // Creamos un arreglo en memoria que simula la tabla de la BD
  private usuarios: Usuario[] = [];
  private ultimoId = 0;

  // Registrar un nuevo usuario simulando el auto_increment
  async crearUsuario(usuario: Omit<Usuario, 'id_usuario'>): Promise<number> {
    this.ultimoId++;
    
    const nuevoUsuario: Usuario = {
      id_usuario: this.ultimoId,
      ...usuario
    };

    this.usuarios.push(nuevoUsuario);
    return nuevoUsuario.id_usuario!;
  }

  // Listar todos los usuarios en memoria
  async obtenerUsuarios(): Promise<Usuario[]> {
    // Retornamos una copia para proteger los datos originales
    return [...this.usuarios];
  }
}