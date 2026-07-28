import { db } from '../config/database';
import { Usuario } from '../models/usuario';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { ValidacionUtil } from '../utils/validaciones';

// Interfaz local para Institución si no la importas de otro modelo
export interface Institucion {
  id_institucion?: number;
  id_usuario: number;
  nombre_institucion: string;
}

export class UsuarioService {
  private pinAdminMaestro = '2026ADMIN';

  async verificarPinAdmin(pinIngresado: string): Promise<boolean> {
    return pinIngresado === this.pinAdminMaestro;
  }

  async cambiarContraseniaAdmin(idUsuarioAdmin: number, nuevoPin: string): Promise<boolean> {
    if (!ValidacionUtil.esContraseniaValida(nuevoPin)) {
      throw new Error('La nueva contraseña debe tener más de 6 dígitos.');
    }

    this.pinAdminMaestro = nuevoPin;
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE usuario SET contrasenia = ? WHERE id_usuario = ? AND rol = "admin"',
      [nuevoPin, idUsuarioAdmin]
    );
    return result.affectedRows > 0;
  }

  async login(correo: string, pass: string): Promise<Usuario | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM usuario WHERE correo = ? AND contrasenia = ?',
      [correo.trim(), pass.trim()]
    );

    if (rows.length === 0) return null;
    return rows[0] as Usuario;
  }

  async registrarUsuario(usuario: Omit<Usuario, 'id_usuario'>): Promise<number> {
    if (!ValidacionUtil.esCorreoValido(usuario.correo)) {
      throw new Error('El correo no es válido. Solo se aceptan dominios @gmail.com, @yahoo.com o @outlook.com.');
    }

    if (!ValidacionUtil.esContraseniaValida(usuario.contrasenia)) {
      throw new Error('La contraseña debe tener estrictamente más de 6 dígitos.');
    }

    if (!ValidacionUtil.esRolValido(usuario.rol)) {
      throw new Error('Debe seleccionar obligatoriamente un rol válido: ciudadano, institucion o admin.');
    }

    // Verificar si el correo ya existe
    const [existentes] = await db.query<RowDataPacket[]>(
      'SELECT id_usuario FROM usuario WHERE correo = ?',
      [usuario.correo.trim()]
    );

    if (existentes.length > 0) {
      throw new Error('El correo ingresado ya se encuentra registrado.');
    }

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO usuario (correo, contrasenia, rol) VALUES (?, ?, ?)',
      [usuario.correo.trim().toLowerCase(), usuario.contrasenia.trim(), usuario.rol.trim().toLowerCase()]
    );
    return result.insertId;
  }

  async crearUsuario(usuario: Omit<Usuario, 'id_usuario'>): Promise<number> {
    return this.registrarUsuario(usuario);
  }

  // ---------------- MÉTODOS DE INSTITUCIÓN RECUPERADOS ----------------

  async registrarInstitucion(institucion: Omit<Institucion, 'id_institucion'>): Promise<number> {
    if (!institucion.nombre_institucion || institucion.nombre_institucion.trim().length === 0) {
      throw new Error('El nombre de la institución es obligatorio.');
    }

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO institucion (id_usuario, nombre_institucion) VALUES (?, ?)',
      [institucion.id_usuario, institucion.nombre_institucion.trim()]
    );
    return result.insertId;
  }

  async obtenerInstitucionPorUsuario(idUsuario: number): Promise<Institucion | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM institucion WHERE id_usuario = ?',
      [idUsuario]
    );
    if (rows.length === 0) return null;
    return rows[0] as Institucion;
  }

  // -------------------------------------------------------------------

  async obtenerTodos(): Promise<Usuario[]> {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id_usuario, correo, rol FROM usuario');
    return rows as Usuario[];
  }

  async obtenerPorId(idUsuario: number): Promise<Usuario | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id_usuario, correo, rol FROM usuario WHERE id_usuario = ?',
      [idUsuario]
    );
    if (rows.length === 0) return null;
    return rows[0] as Usuario;
  }

  async actualizarUsuario(idUsuario: number, datos: Partial<Usuario>): Promise<boolean> {
    if (datos.correo && !ValidacionUtil.esCorreoValido(datos.correo)) {
      throw new Error('El correo no es válido. Solo se aceptan dominios @gmail.com, @yahoo.com o @outlook.com.');
    }

    if (datos.contrasenia && !ValidacionUtil.esContraseniaValida(datos.contrasenia)) {
      throw new Error('La contraseña debe tener estrictamente más de 6 dígitos.');
    }

    if (datos.rol && !ValidacionUtil.esRolValido(datos.rol)) {
      throw new Error('El rol proporcionado no es válido.');
    }

    const [result] = await db.query<ResultSetHeader>(
      'UPDATE usuario SET correo = COALESCE(?, correo), contrasenia = COALESCE(?, contrasenia), rol = COALESCE(?, rol) WHERE id_usuario = ?',
      [
        datos.correo ? datos.correo.trim().toLowerCase() : null,
        datos.contrasenia ? datos.contrasenia.trim() : null,
        datos.rol ? datos.rol.trim().toLowerCase() : null,
        idUsuario
      ]
    );
    return result.affectedRows > 0;
  }

  async eliminarUsuario(idUsuario: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM usuario WHERE id_usuario = ?',
      [idUsuario]
    );
    return result.affectedRows > 0;
  }
}