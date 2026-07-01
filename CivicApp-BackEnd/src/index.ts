import { UsuarioService } from './services/usuarioService';
import { question, rl } from './utils/readLine';

async function main() {
  // Instanciamos el servicio directamente en memoria, ¡sin pasarle ninguna conexión!
  const usuarioService = new UsuarioService();
  
  console.log('\n--- PRUEBA EN MEMORIA ---');
  const correo = await question('Correo electrónico: ');
  const contrasenia = await question('Contraseña: ');
  const rol = await question('Rol: ');

  // Guardamos en el Array
  const nuevoId = await usuarioService.crearUsuario({ correo, contrasenia, rol });
  console.log(`\n[Simulado] Guardado en memoria con ID temporal: ${nuevoId}`);

  // Listamos para verificar
  const lista = await usuarioService.obtenerUsuarios();
  console.table(lista);

  rl.close();
}

main();