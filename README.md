# Airbnb App
Es un proyecto diseñado para replicar las principales funcionalidades de la plataforma Airbnb, proporcionando una experiencia intuitiva y moderna para usuarios que desean buscar, publicar y gestionar propiedades para hospedaje. Este proyecto combina tecnologías de vanguardia como React, Supabase, y Vercel, enfocándose en crear una solución funcional y escalable.

link: https://airbnb-clone-app-livid.vercel.app/

# Pasos para Usar Este Proyecto
1. **Clona el repositorio ejecutando el siguiente comando**

   ```bash
   git clone https://github.com/aledaniel04/Airbnb-App.git
   ```

2. **Instala las dependencias del proyecto ejecutando::**

   ```bash
   npm install
   ```
3. **Inicia el servidor de desarrollo con:**
   
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:** Accede a la aplicación en tu navegador a través del enlace que aparece en el terminal.

5. **Configurar Supabase:** Este proyecto utiliza Supabase como backend. Sigue los pasos para configurarlo:
   - Crear un Proyecto en Supabase,
   - Accede al panel del proyecto y copia las claves de API que necesitarás más adelante: URL del proyecto y Clave Anónima (API Key).
   - En la pestaña "SQL Editor" de Supabase, crea las tablas necesarias.
   - Crea un archivo .env.local en la raíz del proyecto y agrega las siguientes variables: VITE_SUPABASE_URL=tu-url-de-supabase VITE_SUPABASE_ANON_KEY=tu-clave-anonima.

# Principales funcionalidades
### 1. Autenticación (Google, Facebook, OTP, Correo y Contraseña):
- Google y Facebook: Autenticación mediante los servicios de estas plataformas.
- OTP (One-Time Password): Registro mediante un código enviado al número de teléfono del usuario.
- Correo y Contraseña: Método clásico que permite a los usuarios registrarse con su correo electrónico y una contraseña.

![image](https://github.com/user-attachments/assets/67dc697d-40b5-4170-bfe0-9ada9976fc17)

### 2. Gestión Completa de Propiedades (CRUD):
- Crear: Publicación de propiedades mediante un formulario intuitivo, permitiendo subir imágenes, establecer precios, seleccionar comodidades, entre otras cosas.

![image](https://github.com/user-attachments/assets/68d1f84d-808f-4a2b-8eb7-5b7ab424d707)

- Mostrar: Visualización de propiedades en un diseño de cuadrícula limpio y organizado, mostrando imágenes destacadas, títulos, tipos de alojamiento y precios.

![image](https://github.com/user-attachments/assets/20a11873-9ed2-4efc-a476-3aa7b580e089)

- Actualizar: Los usuarios pueden editar cualquier propiedad publicada para actualizar precios, descripciones o imágenes, adaptándose a cambios o necesidades.

![image](https://github.com/user-attachments/assets/830d6049-844e-4be0-bb7b-ab220ee11004)

- Eliminar: Posibilidad de eliminar propiedades directamente desde la interfaz, manteniendo el control total sobre sus publicaciones.

![image](https://github.com/user-attachments/assets/0f423ebc-1391-4113-afdb-2f36bca196f8)

### 3. Búsqueda Avanzada con Filtros y Categorías:
- Filtros Avanzados: Permite a los usuarios buscar propiedades por ubicación, cantidad de huéspedes y fechas específicas.
- Búsqueda por Categorías: Acceso rápido a propiedades según tipos específicos, como playas, cabañas, mansiones, piscinas, entre otros.

![image](https://github.com/user-attachments/assets/e02c63f9-c954-489a-ade3-068251f296da)

### 4. Favoritos: 
Los usuarios tienen la opción de guardar propiedades como favoritas, las propiedades favoritas se almacenan en una sección personalizada, facilitando el acceso rápido en futuras búsquedas.

![image](https://github.com/user-attachments/assets/e760366b-0fce-46cb-ba24-3ebe67e9d9ef)

### 5. Detalles de la Propiedade: 
Al abrir una propiedad específica, los usuarios pueden acceder a una vista detallada que incluye: imágenes principal, información completa (habitaciones, camas, baños, comodidades, entre otras) y mapa de Google Maps que muestra la ubicación exacta del alojamiento.

<img src="https://github.com/user-attachments/assets/d4caf769-87a4-4740-aca2-b33b2c2b3f86" alt="image" width="500" /> <img src="https://github.com/user-attachments/assets/27460dcb-528b-464e-9c7a-b107330d6c1f" alt="image" width="500" height="220"/>

### 6. Diseño Responsivo: 
La aplicación ha sido diseñada con un enfoque resonsivo para garantizar una experiencia de usuario óptima en cualquier dispositivo, ya que cuenta con una Adaptabilidad completa funcionando sin problemas en dispositivos móviles, tablets y computadoras de escritorio.

<img src="https://github.com/user-attachments/assets/662128ed-3874-4079-a943-bf3a3c7e3d43" alt="image" width="700" height="500" /> <img src="https://github.com/user-attachments/assets/ef4dc733-54ea-4b88-b730-cc8c6b8e6c11" alt="image" width="300" height="500"  />

### Estructura del Backend: 
El backend de la aplicación está diseñado para ser eficiente, escalable y fácil de gestionar utilizando <b>Supabase</b>, una alternativa a firebase moderna y basada en PostgreSQL. La relación entre las Tablas están diseñadas con claves foráneas, por ejemplo, La relación entre propiedades y auth.users asegura que cada propiedad está vinculada a un usuario autenticado.

![image](https://github.com/user-attachments/assets/4bb2aaca-fb0e-4adf-a705-f3707f4b4866)

## Tecnologías utilizadas

![React](https://shields.io/badge/react-black?logo=react&style=for-the-badge)

![tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-grey?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC)

![Supabase](https://img.shields.io/badge/supabase-%23559e46?style=for-the-badge&logo=supabase&logoColor=%233FCF8E&labelColor=black)

![Vercel](https://img.shields.io/badge/vercel-black?style=for-the-badge&logo=vercel&logoColor=%23000000&labelColor=white)

