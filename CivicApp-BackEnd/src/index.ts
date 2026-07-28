import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import ciudadanoRoutes from './routes/ciudadanoRoutes';
import institucionRoutes from './routes/institucionRoutes';
import denunciaRoutes from './routes/denunciaRoutes';
import estadoRoutes from './routes/estadoRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import evidenciaRoutes from './routes/evidenciaRoutes';
import comentarioRoutes from './routes/comentarioRoutes';
import seguimientoRoutes from './routes/seguimientoRoutes';
import notificacionRoutes from './routes/notificacionRoutes';

const app = express();

app.use(cors());
app.use(express.json());

const registrarRuta = (path: string, router: any) => {
  if (typeof router !== 'function') {
    console.error(`❌ ERROR: El módulo de rutas para '${path}' no es una función válida (posible export default faltante).`);
  }
  app.use(path, router);
};

registrarRuta('/api/auth', authRoutes);
registrarRuta('/api/usuarios', usuarioRoutes);
registrarRuta('/api/ciudadanos', ciudadanoRoutes);
registrarRuta('/api/instituciones', institucionRoutes);
registrarRuta('/api/denuncias', denunciaRoutes);
registrarRuta('/api/estados', estadoRoutes);
registrarRuta('/api/categorias', categoriaRoutes);
registrarRuta('/api/evidencias', evidenciaRoutes);
registrarRuta('/api/comentarios', comentarioRoutes);
registrarRuta('/api/seguimientos', seguimientoRoutes);
registrarRuta('/api/notificaciones', notificacionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});