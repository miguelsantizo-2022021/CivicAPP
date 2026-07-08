import { AppMenu } from './menu/menu';

async function bootstrap() {
  // Instanciamos el menú orquestador
  const app = new AppMenu();
  
  // Encendemos la interfaz interactiva
  await app.iniciar();
}

bootstrap();