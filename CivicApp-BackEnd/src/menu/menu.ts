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

  // --- MÉTODOS DE VALIDACIÓN INTERNOS ---
  private esTextoValido(texto: string): boolean {
    return texto !== undefined && texto !== null && texto.trim().length > 0;
  }

  private esCorreoValido(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo.trim());
  }

  private esNumeroEnRango(valor: string, min: number, max: number): boolean {
    const num = Number(valor);
    return !isNaN(num) && Number.isInteger(num) && num >= min && num <= max;
  }

  // --- VISTAS DE MENÚS ---
  private mostrarMenuPublico() {
    console.log('=======================================');
    console.log('       CIVICAPP - BIENVENIDO           ');
    console.log('=======================================');
    console.log('1. Iniciar Sesión (Login)');
    console.log('2. Registrarse (Crear Cuenta)');
    console.log('3. Salir');
    console.log('=======================================');
  }

  private mostrarMenuPrivado() {
    console.log('=======================================');
    console.log(`     CIVICAPP - PANEL DE CONTROL      `);
    console.log(`     Usuario: ${this.usuarioLogueado?.correo} `);
    console.log('=======================================');
    console.log('1. Hacer una Denuncia');
    console.log('2. Ver mis Denuncias');
    console.log('3. Listar todas las Denuncias del sistema');
    console.log('4. Cerrar Sesión');
    console.log('=======================================');
  }

  // --- FLUJO PRIVADO DE DENUNCIAS ---
  private async flujoAppPrivada() {
    let enApp = true;

    while (enApp) {
      this.mostrarMenuPrivado();
      const opcion = await question('Selecciona una opción (1-4): ');

      switch (opcion.trim()) {
        case '1':
          console.log('\n=======================================');
          console.log('       REGISTRAR NUEVA DENUNCIA        ');
          console.log('=======================================');

          // 1. Validar Título
          let titulo = '';
          while (!this.esTextoValido(titulo)) {
            titulo = await question('Título corto (ej: Música alta a deshoras): ');
            if (!this.esTextoValido(titulo)) console.log(' El título es obligatorio.');
          }

          // 2. Seleccionar Categoría Ampliada
          console.log('\nCategorías disponibles:');
          console.log('1. Baches / Vías públicas');
          console.log('2. Alumbrado / Electricidad');
          console.log('3. Servicio de Agua');
          console.log('4. Ciudadano Problemático / Alteración al orden');
          console.log('5. Acumulación de Basura / Limpieza');

          let categoriaStr = '';
          while (!this.esNumeroEnRango(categoriaStr, 1, 5)) {
            categoriaStr = await question('Selecciona la categoría (1-5): ');
            if (!this.esNumeroEnRango(categoriaStr, 1, 5)) {
              console.log(' Ingresa una opción válida entre 1 y 5.');
            }
          }

          // 3. Validar Ubicación Especifica (Ciudad y Zona)
          let ciudad = '';
          while (!this.esTextoValido(ciudad)) {
            ciudad = await question('Ciudad / Municipio (ej: Guatemala, Mixco): ');
            if (!this.esTextoValido(ciudad)) console.log(' La ciudad es obligatoria.');
          }

          let zonaStr = '';
          while (!this.esNumeroEnRango(zonaStr, 1, 25)) {
            zonaStr = await question('Número de Zona (1-25): ');
            if (!this.esNumeroEnRango(zonaStr, 1, 25)) {
              console.log(' Ingresa un número de zona válido (1-25).');
            }
          }

          const direccionExacta = await question('Dirección exacta (Opcional - ej: 5ta Av 12-44): ');

          // 4. Validar Descripción del problema
          let descripcion = '';
          while (!this.esTextoValido(descripcion)) {
            descripcion = await question('Descripción detallada de la situación: ');
            if (!this.esTextoValido(descripcion)) console.log(' La descripción es obligatoria.');
          }

          // 5. Enviar Denuncia
          try {
            console.log(' Enviando reporte al sistema...');
            const idCiudadano = this.usuarioLogueado!.id_usuario!;
            
            const nuevaDenunciaId = await this.denunciaService.crearDenuncia({
              id_ciudadano: idCiudadano,
              id_categoria: Number(categoriaStr),
              id_estado: 1, // 1 = Pendiente
              titulo: titulo.trim(),
              descripcion: descripcion.trim(),
              ciudad: ciudad.trim(),
              zona: Number(zonaStr),
              direccion_exacta: direccionExacta.trim() || undefined
            } as any);

            console.log(` [Éxito] Denuncia #${nuevaDenunciaId} registrada correctamente para ${ciudad}, Zona ${zonaStr}.`);
          } catch (error: any) {
            console.error(' [Error al crear la denuncia]:', error.message);
          }
          break;

        case '2':
          console.log('--- MIS DENUNCIAS ---');
          try {
            console.log(' Cargando tus denuncias...');
            const todas = await this.denunciaService.listarDenuncias();
            const misDenuncias = todas.filter(d => d.id_ciudadano === this.usuarioLogueado!.id_usuario);
            misDenuncias.length === 0 ? console.log('No has registrado ninguna denuncia aún.') : console.table(misDenuncias);
          } catch (error: any) {
            console.error(' [Error]:', error.message);
          }
          break;

        case '3':
          console.log('--- TODAS LAS DENUNCIAS DEL SISTEMA ---');
          try {
            console.log('⏳ Cargando historial general...');
            const todas = await this.denunciaService.listarDenuncias();
            todas.length === 0 ? console.log('No hay denuncias en el sistema.') : console.table(todas);
          } catch (error: any) {
            console.error(' [Error]:', error.message);
          }
          break;

        case '4':
          console.log('Cerrando sesión de forma segura...');
          this.usuarioLogueado = null;
          enApp = false;
          break;

        default:
          console.log(' Opción inválida. Elige un número del 1 al 4.');
          break;
      }
    }
  }

  // --- MÉTODOS PÚBLICOS / INICIO ---
  public async iniciar() {
    let ejecucionActiva = true;

    while (ejecucionActiva) {
      this.mostrarMenuPublico();
      const opcion = await question('Selecciona una opción (1-3): ');

      switch (opcion.trim()) {
        case '1':
          console.log('\n--- INICIAR SESIÓN ---');
          let correoLogin = '';
          while (!this.esTextoValido(correoLogin)) {
            correoLogin = await question('Correo electrónico: ');
            if (!this.esTextoValido(correoLogin)) console.log(' Debes ingresar tu correo.');
          }

          const passLogin = await question('Contraseña: ');

          console.log('⏳ Verificando credenciales...');
          const usuariosRegistrados = await this.usuarioService.obtenerUsuarios();
          const usuarioEncontrado = usuariosRegistrados.find(
            u => u.correo === correoLogin.trim() && u.contrasenia === passLogin
          );

          if (usuarioEncontrado) {
            console.log(` ¡Bienvenido de nuevo, ${usuarioEncontrado.correo}!`);
            this.usuarioLogueado = usuarioEncontrado;
            await this.flujoAppPrivada();
          } else {
            console.log(' Credenciales incorrectas. Verifica tu correo y contraseña.');
          }
          break;

        case '2':
          console.log('\n--- REGISTRO DE CUENTA ---');
          
          // Validar correo
          let nuevoCorreo = '';
          while (!this.esCorreoValido(nuevoCorreo)) {
            nuevoCorreo = await question('Correo electrónico (ej: usuario@correo.com): ');
            if (!this.esCorreoValido(nuevoCorreo)) console.log(' Formato de correo inválido.');
          }

          // Validar contraseña
          let nuevaPass = '';
          while (!this.esTextoValido(nuevaPass) || nuevaPass.trim().length < 4) {
            nuevaPass = await question('Contraseña (mínimo 4 caracteres): ');
            if (nuevaPass.trim().length < 4) console.log(' La contraseña debe tener al menos 4 caracteres.');
          }

          // Validar Rol
          let rol = '';
          while (rol !== 'ciudadano' && rol !== 'institucion') {
            rol = (await question('Rol (escribe: "ciudadano" o "institucion"): ')).trim().toLowerCase();
            if (rol !== 'ciudadano' && rol !== 'institucion') {
              console.log(' Debes escribir exactamente "ciudadano" o "institucion".');
            }
          }

          try {
            console.log(' Guardando nuevo usuario...');
            const nuevoId = await this.usuarioService.crearUsuario({
              correo: nuevoCorreo.trim(),
              contrasenia: nuevaPass,
              rol
            });

            if (rol === 'ciudadano') {
              let nombre = '';
              while (!this.esTextoValido(nombre)) {
                nombre = await question('Nombre completo: ');
                if (!this.esTextoValido(nombre)) console.log(' El nombre es obligatorio.');
              }

              let telefono = '';
              while (!this.esTextoValido(telefono)) {
                telefono = await question('Número de teléfono: ');
                if (!this.esTextoValido(telefono)) console.log(' El teléfono es obligatorio.');
              }

              await this.ciudadanoService.registrarCiudadano({ id_usuario: nuevoId, nombre, telefono });
            }

            console.log(` [Éxito] Cuenta creada con ID: ${nuevoId}. Ya puedes iniciar sesión.`);
          } catch (error: any) {
            console.error(' [Error en Registro]:', error.message);
          }
          break;

        case '3':
          console.log('Saliendo de CivicApp... ¡Hasta luego!');
          ejecucionActiva = false;
          break;

        default:
          console.log(' Opción no válida. Elige 1, 2 o 3.');
          break;
      }
    }
    rl.close();
  }
}