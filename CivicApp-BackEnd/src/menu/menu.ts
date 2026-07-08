import { UsuarioService } from '../services/usuarioService';
import { CiudadanoService } from '../services/ciudadanosService';
import { DenunciaService } from '../services/denunciaService';
import { question, rl } from '../utils/readLine';
import { Usuario } from '../models/usuario';

export class AppMenu {
  private usuarioService = new UsuarioService();
  private ciudadanoService = new CiudadanoService();
  private denunciaService = new DenunciaService();
  private usuarioLogueado: Usuario | null = null;

  private mostrarMenuPublico() {
    console.log('\n=======================================');
    console.log('       CIVICAPP - BIENVENIDO           ');
    console.log('=======================================');
    console.log('1. Iniciar Sesión (Login)');
    console.log('2. Registrarse (Crear Cuenta)');
    console.log('3. Salir');
    console.log('=======================================');
  }

  private mostrarMenuPrivado() {
    console.log('\n=======================================');
    console.log(`     CIVICAPP - PANEL DE CONTROL      `);
    console.log(`     Usuario: ${this.usuarioLogueado?.correo} `);
    console.log('=======================================');
    console.log('1. Hacer una Denuncia');
    console.log('2. Ver mis Denuncias');
    console.log('3. Listar todas las Denuncias del sistema');
    console.log('4. Cerrar Sesión');
    console.log('=======================================');
  }

  private async flujoAppPrivada() {
    let enApp = true;

    while (enApp) {
      this.mostrarMenuPrivado();
      const opcion = await question('Selecciona una opción (1-4): ');

      switch (opcion.trim()) {
        case '1':
          console.log('\n--- NUEVA DENUNCIA ---');
          const descripcion = await question('Describe el problema comunitario: ');
          const latitudInput = await question('Ingresa la latitud (ej: 14.634): ');
          const longitudInput = await question('Ingresa la longitud (ej: -90.506): ');
          const categoriaInput = await question('ID de Categoría (1-Baches, 2-Alumbrado): ');

          try {
            const idCiudadano = this.usuarioLogueado!.id_usuario!; 
            const nuevaDenunciaId = await this.denunciaService.crearDenuncia({
              id_ciudadano: idCiudadano,
              id_categoria: Number(categoriaInput),
              id_estado: 1, // Pendiente
              descripcion,
              latitud: Number(latitudInput),
              longitud: Number(longitudInput)
            });
            console.log(`\n[Éxito] Denuncia registrada con código: #00${nuevaDenunciaId}`);
          } catch (error: any) {
            console.error('\n[Error]:', error.message);
          }
          break;

        case '2':
          console.log('\n--- MIS DENUNCIAS ---');
          try {
            const todas = await this.denunciaService.listarDenuncias();
            const misDenuncias = todas.filter(d => d.id_ciudadano === this.usuarioLogueado!.id_usuario);
            misDenuncias.length === 0 ? console.log('No tienes denuncias.') : console.table(misDenuncias);
          } catch (error: any) {
            console.error('[Error]', error.message);
          }
          break;

        case '3':
          console.log('\n--- TODAS LAS DENUNCIAS ---');
          try {
            const todas = await this.denunciaService.listarDenuncias();
            todas.length === 0 ? console.log('No hay denuncias en el sistema.') : console.table(todas);
          } catch (error: any) {
            console.error('[Error]', error.message);
          }
          break;

        case '4':
          console.log('\nCerrando sesión de forma segura...');
          this.usuarioLogueado = null;
          enApp = false;
          break;

        default:
          console.log('\nOpción inválida.');
          break;
      }
    }
  }

  // Método principal que arrancará todo
  public async iniciar() {
    let ejecucionActiva = true;

    while (ejecucionActiva) {
      this.mostrarMenuPublico();
      const opcion = await question('Selecciona una opción (1-3): ');

      switch (opcion.trim()) {
        case '1':
          console.log('\n--- INICIAR SESIÓN ---');
          const correoLogin = await question('Correo electrónico: ');
          const passLogin = await question('Contraseña: ');

          const usuariosRegistrados = await this.usuarioService.obtenerUsuarios();
          const usuarioEncontrado = usuariosRegistrados.find(
            u => u.correo === correoLogin.trim() && u.contrasenia === passLogin
          );

          if (usuarioEncontrado) {
            console.log(`\n[OK] ¡Bienvenido, ${usuarioEncontrado.correo}!`);
            this.usuarioLogueado = usuarioEncontrado;
            await this.flujoAppPrivada();
          } else {
            console.log('\n[Alerta] Credenciales incorrectas.');
          }
          break;

        case '2':
          console.log('\n--- REGISTRO DE CUENTA ---');
          const nuevoCorreo = await question('Correo electrónico: ');
          const nuevaPass = await question('Contraseña: ');
          const rol = await question('Rol (ciudadano/institucion): ');

          try {
            const nuevoId = await this.usuarioService.crearUsuario({
              correo: nuevoCorreo.trim(),
              contrasenia: nuevaPass,
              rol: rol.trim()
            });

            if (rol.trim() === 'ciudadano') {
              const nombre = await question('Tu nombre completo: ');
              const telefono = await question('Tu número de teléfono: ');
              await this.ciudadanoService.registrarCiudadano({ id_usuario: nuevoId, nombre, telefono });
            }
            console.log(`\n[Éxito] Cuenta creada con ID: ${nuevoId}. Ya puedes loguearte.`);
          } catch (error: any) {
            console.error('\n[Error en Registro]:', error.message);
          }
          break;

        case '3':
          console.log('\nSaliendo de CivicApp... ¡Hasta luego!');
          ejecucionActiva = false;
          break;

        default:
          console.log('\nOpción no válida.');
          break;
      }
    }
    rl.close();
  }
}