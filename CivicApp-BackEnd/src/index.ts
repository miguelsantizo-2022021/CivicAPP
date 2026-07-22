import { AppMenu } from './menu/menu';

async function bootstrap() {
  const app = new AppMenu();
  
  await app.iniciar();
}

bootstrap();