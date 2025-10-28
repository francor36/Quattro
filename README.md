💻 Proyecto Backend - Quattro E-Commerce

Este proyecto es un backend completo para un e-commerce, desarrollado con Node.js, Express y SQL (MySQL/SQLite).
Se puede usar tanto como trabajo práctico para la materia de Backend como plataforma funcional para clientes reales de e-commerce.

📝 Objetivo del proyecto

💾 Administrar usuarios y productos

🔒 Autenticación y seguridad con JWT y contraseñas encriptadas

📦 Gestión de productos: alta, baja, modificación y listado

🖼 Carga de archivos para imágenes de productos

⚡ Notificaciones en tiempo real usando Socket.IO

🛠 Validaciones de datos con Joi para evitar errores en la base de datos

👨‍🏫 Como trabajo de materia Backend

Permite demostrar manejo de rutas, controladores y middlewares.

Integra bases de datos SQL, usando TypeORM para conexión y consultas.

Implementa autenticación segura con JWT y hashing de contraseñas.

Valida datos con Joi, asegurando que no se ingresen datos inválidos.

Usa Multer para subir archivos, como imágenes de productos.

Permite probar todo en Postman, haciendo el flujo completo de registro → login → operaciones protegidas.

🛒 Como solución para clientes e-commerce

👤 Usuarios: pueden registrarse, iniciar sesión y ver sus datos.

🛍 Productos: los administradores pueden crear, actualizar, eliminar y listar productos.

🖼 Imágenes: cada producto puede tener imágenes asociadas.

⚡ Tiempo real: se pueden notificar cambios de productos a otros clientes en tiempo real (Socket.IO).

🔐 Seguridad: solo los usuarios con token válido pueden acceder a ciertas rutas protegidas.

💾 Base de datos SQL: almacena toda la información de forma persistente y estructurada.

📦 Funcionalidades principales
Módulo	Funcionalidad	Observaciones
Usuarios	Registro, login, ver usuario, borrar usuario	JWT + bcrypt
Productos	Crear, leer, actualizar, eliminar productos	Validaciones + subida de imágenes
Archivos	Subida de imágenes con Multer	Guardadas en /uploads
Socket.IO	Notificaciones en tiempo real	Para nuevos productos o cambios
Validación	Joi para todos los schemas	Evita datos inválidos
