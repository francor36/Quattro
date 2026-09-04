📌 Quattro Backend – Presentación para Materia y Clientes E-Commerce

1️⃣ Introducción

Este proyecto es un backend en desarrollo para un e-commerce, desarrollado en Node.js, Express y SQL.
Sirve tanto como trabajo de la materia Backend.

2️⃣ Objetivos del proyecto

💾 Administrar usuarios y productos

🔒 Autenticación segura con JWT

🖼 Subida de imágenes para productos

⚡ Notificaciones en tiempo real con Socket.IO

🛠 Validación de datos con Joi

📦 Gestión de productos: crear, actualizar, eliminar, listar

3️⃣ Usuarios

👤 Registro de usuarios (/users/register)

🔑 Login (/users/login) → obtiene JWT

📄 Ver usuario por ID (/users/:id) → protegido

❌ Borrar usuario (/users/:id) → protegido

4️⃣ Productos

🛍 Crear producto (POST /products)→ protegido

📃 Listar productos (GET /products)

🔍 Ver producto (GET /products/:id)

✏️ Actualizar producto (PUT /products/:id) → protegido

🗑 Eliminar producto (DELETE /products/:id) → protegido

5️⃣ Carga de archivos

🖼 Imágenes de productos usando Multer

Archivos guardados en /uploads

6️⃣ Socket.IO

⚡ Comunicación en tiempo real

Ejemplo: notificación de nuevo producto agregado

socket.on('new-product', (product) => {
  console.log('Nuevo producto:', product);
});

7️⃣ Seguridad

🔐 JWT para proteger rutas sensibles

🔑 Contraseñas encriptadas con bcrypt

Validación de datos con Joi

8️⃣ Base de datos

💾 MySQL / SQLite

Tablas para usuarios y productos

Relaciones claras y persistentes

9️⃣ Tecnologías
Categoría	Tecnologías
Backend	Node.js, Express
DB	TypeORM, MySQL / SQLite
Seguridad	JWT, bcrypt
Validación	Joi
Archivos	Multer
Tiempo real	Socket.IO
Utilidades	dotenv, cors, uuid, nodemon, signale
🔧 Scripts útiles
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}



npm run start → desarrollo con reinicio automático

npm start → producción

10️⃣ Beneficios

✅ Para materia: demuestra backend, seguridad y bases de datos

✅ Para cliente: plataforma funcional para e-commerce

✅ Escalable: se puede agregar carrito de compras, pagos, notificaciones, etc.

<img width="551" height="258" alt="Diagrama de clase" src="https://github.com/user-attachments/assets/51fb3f7b-de70-49a0-81e2-43c3035f291e" />

<img width="918" height="353" alt="MER" src="https://github.com/user-attachments/assets/804e14a4-306c-41e0-8a21-23562d9d561c" />

<img width="449" height="222" alt="diagrama de caso de uso" src="https://github.com/user-attachments/assets/2595a7f8-6bd9-437f-9a45-0aa1264aabc8" />

<img width="581" height="597" alt="image" src="https://github.com/user-attachments/assets/0a7d4ff5-16fa-44b1-9176-1b370131c091" />
