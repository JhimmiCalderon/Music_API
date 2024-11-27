# API RESTful para Plataforma Musical

Este proyecto es una API RESTful construida con **Node.js**, **Express**, **MongoDB** y **JWT**, diseñada para gestionar una plataforma musical similar a **Spotify**. Permite realizar operaciones CRUD completas para artistas, álbumes y canciones, así como la autenticación de usuarios.

## Descripción

Esta API permite a los usuarios:

- Registrarse y autenticarse de manera segura.
- Crear y gestionar artistas, incluyendo sus imágenes y descripciones.
- Crear y gestionar álbumes y canciones.
- Subir archivos asociados a los artistas, álbumes y canciones.

## Dependencias

### Librerías principales

- **bcrypt**: Biblioteca para el cifrado de contraseñas.
- **cors**: Middleware para habilitar solicitudes desde diferentes orígenes (CORS).
- **express**: Framework minimalista para crear aplicaciones web y APIs en Node.js.
- **jwt-simple**: Biblioteca para generar y verificar tokens JWT en la autenticación.
- **moment**: Biblioteca para el manejo de fechas y horas.
- **mongoose**: ODM (Object Data Modeling) para MongoDB, utilizado para interactuar con la base de datos.
- **mongoose-pagination**: Extensión de Mongoose para paginar resultados de consultas.
- **multer**: Middleware para manejar la carga de archivos, como imágenes y canciones.
- **validator**: Biblioteca para validar y sanitizar cadenas de texto.

### Dependencias de desarrollo

- **nodemon**: Herramienta para desarrollar de manera más eficiente, reiniciando automáticamente el servidor cuando detecta cambios en el código fuente.
- 
- ## Diseño de la Base de Datos

Aquí puedes ver el diseño de la base de datos de la API musical:

![image](https://github.com/user-attachments/assets/8c016c74-1a7d-4d56-9edc-4025d8fb027b)



## Archivos importantes

### `run.bat`

Para iniciar tanto la base de datos como el servidor, se ha creado un archivo **`run.bat`**. 
