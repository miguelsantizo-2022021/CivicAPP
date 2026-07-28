import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuarioService';
import { CiudadanoService } from '../services/ciudadanosService';

const usuarioService = new UsuarioService();
const ciudadanoService = new CiudadanoService();

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { correo, contrasenia } = req.body;
      if (!correo || !contrasenia) {
        res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
        return;
      }

      const usuario = await usuarioService.login(correo, contrasenia);
      if (!usuario) {
        res.status(401).json({ error: 'Credenciales inválidas.' });
        return;
      }

      let perfil = null;
      if (usuario.rol === 'ciudadano') {
        perfil = await ciudadanoService.obtenerCiudadanoPorUsuario(usuario.id_usuario!);
      } else if (usuario.rol === 'institucion') {
        perfil = await usuarioService.obtenerInstitucionPorUsuario(usuario.id_usuario!);
      }

      res.json({ mensaje: 'Login exitoso', usuario, perfil });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async registrarCiudadano(req: Request, res: Response): Promise<void> {
    try {
      const { correo, contrasenia, nombre, telefono } = req.body;

      if (!nombre || nombre.trim().length === 0) {
        res.status(400).json({ error: 'El nombre del ciudadano es obligatorio.' });
        return;
      }

      // registrarUsuario ejecutará las validaciones de correo @gmail/@yahoo/@outlook y pass > 6
      const idUsuario = await usuarioService.registrarUsuario({
        correo,
        contrasenia,
        rol: 'ciudadano'
      });

      const idCiudadano = await ciudadanoService.registrarCiudadano({
        id_usuario: idUsuario,
        nombre,
        telefono
      });

      res.status(201).json({
        mensaje: 'Ciudadano registrado con éxito',
        id_usuario: idUsuario,
        id_ciudadano: idCiudadano
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async registrarInstitucion(req: Request, res: Response): Promise<void> {
    try {
      const { correo, contrasenia, nombre_institucion } = req.body;

      if (!nombre_institucion || nombre_institucion.trim().length === 0) {
        res.status(400).json({ error: 'El nombre de la institución es obligatorio.' });
        return;
      }

      const idUsuario = await usuarioService.registrarUsuario({
        correo,
        contrasenia,
        rol: 'institucion'
      });

      const idInstitucion = await usuarioService.registrarInstitucion({
        id_usuario: idUsuario,
        nombre_institucion
      });

      res.status(201).json({
        mensaje: 'Institución registrada con éxito',
        id_usuario: idUsuario,
        id_institucion: idInstitucion
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async loginAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { pin } = req.body;
      if (!pin) {
        res.status(400).json({ error: 'El PIN de administrador es obligatorio.' });
        return;
      }

      const esValido = await usuarioService.verificarPinAdmin(pin);

      if (!esValido) {
        res.status(401).json({ error: 'PIN Maestro incorrecto' });
        return;
      }

      res.json({ mensaje: 'Acceso de Administrador concedido', rol: 'admin' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}