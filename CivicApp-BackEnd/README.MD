Civic App:
El objetivo principal es actuar como un puente de comunicación transparente entre los ciudadanos y las intituciones publicas, permitiendo reportar problemas en la comunidad

Entidades del sistema:
- usuario: Credenciales de acceso, correos únicos y roles del sistema
- ciudadano: Información de perfil y contacto de los residentes locales
- institucion: Registro de las entidades públicas responsables de atender los reportes
- categoria: Clasificación del tipo de reporte (ej. baches estructurales, luminarias dañadas, basureros clandestinos)
- estado: Catálogo de fases del reporte (Creado, En Proceso, Resuelto)
- denuncia: Núcleo del sistema que almacena la descripción, coordenadas y llaves foraneas de control
- evidencia: Rutas de almacenamiento de los archivos vinculados a las denuncias
- comentario: Mensajes e hilos e conversación asociados a un reporte y un autor
- seguimiento: Bitácora histórica que registra los cambios de estado (anterior y nuevo) junto a su marca de tiempo
- notificacion: Alertas del sistema dirigidas a usuarios específicos con banderas de lectura


Endpoints de la API (URLs para Postman)

Base URL: `http://localhost:3000/api`

1. Autenticación (`/auth`)
* `POST /api/auth/login` - Iniciar sesión

2. Usuarios (`/usuarios`)
* `GET /api/usuarios` - Listar todos
* `GET /api/usuarios/:id` - Obtener por ID
* `POST /api/usuarios` - Crear usuario
* `PUT /api/usuarios/:id` - Actualizar usuario
* `DELETE /api/usuarios/:id` - Eliminar usuario

3. Ciudadanos (`/ciudadanos`)
* `GET /api/ciudadanos` - Listar todos
* `GET /api/ciudadanos/:id` - Obtener por ID
* `POST /api/ciudadanos` - Crear ciudadano
* `PUT /api/ciudadanos/:id` - Actualizar ciudadano
* `DELETE /api/ciudadanos/:id` - Eliminar ciudadano

4. Instituciones (`/instituciones`)
* `GET /api/instituciones` - Listar todas
* `GET /api/instituciones/:id` - Obtener por ID
* `POST /api/instituciones` - Crear institución
* `PUT /api/instituciones/:id` - Actualizar institución
* `DELETE /api/instituciones/:id` - Eliminar institución

5. Categorías (`/categorias`)
* `GET /api/categorias` - Listar todas
* `GET /api/categorias/:id` - Obtener por ID
* `POST /api/categorias` - Crear categoría
* `PUT /api/categorias/:id` - Actualizar categoría
* `DELETE /api/categorias/:id` - Eliminar categoría

6. Estados (`/estados`)
* `GET /api/estados` - Listar todos
* `GET /api/estados/:id` - Obtener por ID
* `POST /api/estados` - Crear estado
* `PUT /api/estados/:id` - Actualizar estado
* `DELETE /api/estados/:id` - Eliminar estado

7. Denuncias (`/denuncias`)
* `GET /api/denuncias` - Listar todas
* `GET /api/denuncias/:id` - Obtener por ID
* `GET /api/denuncias/estado/:idEstado` - Filtrar denuncias por estado
* `POST /api/denuncias` - Crear denuncia
* `PUT /api/denuncias/:id` - Actualizar denuncia
* `PATCH /api/denuncias/:id/estado` - Cambiar estado (con seguimiento, comentario y notificación automática)
* `DELETE /api/denuncias/:id` - Eliminar denuncia

8. Evidencias (`/evidencias`)
* `GET /api/evidencias/denuncia/:idDenuncia` - Obtener evidencias de una denuncia
* `POST /api/evidencias` - Crear evidencia
* `DELETE /api/evidencias/:id` - Eliminar evidencia

9. Comentarios (`/comentarios`)
* `GET /api/comentarios/denuncia/:idDenuncia` - Obtener comentarios de una denuncia
* `POST /api/comentarios` - Crear comentario
* `PUT /api/comentarios/:id` - Actualizar comentario
* `DELETE /api/comentarios/:id` - Eliminar comentario

10. Seguimientos (`/seguimientos`)
* `GET /api/seguimientos/denuncia/:idDenuncia` - Obtener historial de seguimiento de una denuncia
* `POST /api/seguimientos` - Registrar cambio manualmente

11. Notificaciones (`/notificaciones`)
* `GET /api/notificaciones/usuario/:idUsuario` - Obtener notificaciones de un usuario
* `POST /api/notificaciones` - Crear notificación
* `PATCH /api/notificaciones/:id/leida` - Marcar notificación como leída
* `DELETE /api/notificaciones/:id` - Eliminar notificación