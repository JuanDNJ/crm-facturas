# CRM de Facturas

Este proyecto es un sistema de Customer Relationship Management (CRM) enfocado en la gestión de facturas, construido con tecnologías modernas para ofrecer una experiencia de usuario eficiente y robusta.

## 🚀 Tecnologías Utilizadas

* **Frontend:** React (con Vite para un desarrollo rápido)
* **Lenguaje:** TypeScript
* **Estilos/UI:** Tailwind CSS (reemplazando Material UI)
* **Enrutamiento:** React Router DOM
* **Backend/Base de Datos/Autenticación:** Firebase (Authentication, Firestore y Storage)
* **Manejo de Estado de Autenticación:** `react-firebase-hooks`
* **Validación de Formularios:** `react-hook-form` y `zod`
* **Notificaciones:** `react-toastify`
* **Variables de Entorno:** `dotenv` (integrado con Vite)

### ♻️ Estrategia de Refactorización (Principios SOLID)

**¡IMPORTANTE! Esta estrategia es un pilar fundamental para el desarrollo y mantenimiento de este proyecto. Seguirla es IMPRESCINDIBLE para asegurar la escalabilidad, la claridad del código y la facilidad de futuras modificaciones.**

Para asegurar la escalabilidad y mantenibilidad del proyecto, se está implementando una estrategia de refactorización basada en los principios SOLID, con un enfoque inicial en el **Principio de Responsabilidad Única (SRP)**. Esto implica:

* **Separación de Lógica en Hooks Personalizados:** La lógica de negocio, manejo de estado y llamadas a la API se extraerá de los componentes de React y se encapsulará en hooks personalizados (ej. `useSealsLogic.ts`). Esto permite que los componentes se centren únicamente en la renderización de la interfaz de usuario. **Se ha añadido `useMediaQuery.ts` para la detección de tamaño de pantalla y se ha refactorizado `useSealsLogic.ts` para centralizar la gestión de datos de sellos y la paginación con scroll infinito.**
* **Componentes Presentacionales:** La interfaz de usuario se dividirá en componentes más pequeños y reutilizables, que serán puramente presentacionales y recibirán sus datos y funciones a través de props (ej. `SealFormModal.tsx` para el formulario del modal y `SealCard.tsx` para la visualización individual de sellos). **Se han creado `SealForm.tsx` (formulario base) y `SealFormSidebar.tsx` (contenedor para panel lateral), y `SealCard.tsx` (tarjeta de sello simplificada y modularizada) para una mayor modularidad.**
* **Servicios de Datos (Opcional):** Para una mayor abstracción y desacoplamiento, se podría considerar la creación de una capa de servicios para interactuar con Firebase, separando aún más la lógica de acceso a datos.

Esta aproximación mejorará la claridad del código, facilitará las pruebas y permitirá una evolución más sencilla del proyecto.

Aquí se detalla el estado actual de las funcionalidades del CRM:

### **Funcionalidades Implementadas (✅)**

* **Autenticación de Usuarios:**
  * ✅ Registro de nuevos usuarios.
  * ✅ Inicio de sesión de usuarios existentes.
  * ✅ Protección de rutas (rutas públicas y protegidas).
* **Dashboard:**
  * ✅ Página principal para usuarios autenticados.
* **Perfil de Usuario:**
  * ✅ Visualización del email del usuario.
  * ✅ Actualización del nombre de usuario (`userName`) y apellidos (`userLastName`) en Firestore.
  * ✅ Añadidos campos para nombre de empresa, NIF/CIF, dirección, ciudad y país.
  * ✅ Funcionalidad para subir foto de perfil a Firebase Storage y guardar su URL en Firestore.
  * ✅ Generación de IBAN aleatorio para pruebas (si no existe).
  * ✅ Campos para IBAN, moneda por defecto, IVA por defecto e IRPF por defecto.
* **Gestión de Sellos:**
  * ✅ Creación de una página dedicada para la gestión de sellos (`/seals`).
  * ✅ Funcionalidades CRUD (Crear, Leer, Actualizar, Eliminar) para sellos de usuario.
  * ✅ Subida de imágenes de sellos a Firebase Storage.
  * ✅ Formulario de creación/edición de sellos responsivo (modal en móvil/tablet, panel lateral en escritorio).
  * ✅ Validación de formularios mejorada con `zod` y `react-hook-form` (campos obligatorios, mensajes de error, botón de envío deshabilitado).
  * ✅ Pre-rellenado automático de nombre y apellidos del perfil de usuario en el formulario de sellos.
  * ✅ Notificaciones al usuario con `react-toastify`.
  * ✅ Pre-rellenado automático de datos fiscales del usuario (nombre de empresa, NIF/CIF, dirección, ciudad, país) en el formulario de sellos.
  * ✅ Implementación de scroll infinito para la lista de sellos.
  * ✅ Componente `SealCard` simplificado y modularizado, con botones de acción (Editar, Eliminar, Visualizar) en la parte inferior derecha.
* **Navegación:**
  * ✅ Componente `Header` global para navegación básica.
* **Estilos:**
  * ✅ Integración completa de Tailwind CSS.
  * ✅ Reemplazo de Material UI por Tailwind CSS en componentes existentes.
  * ✅ Eliminación de `App.css` ya que no se utilizaba y los estilos se gestionan con Tailwind CSS.
* **Configuración:**
  * ✅ Integración y configuración de Firebase (Auth, Firestore y Storage).
  * ✅ Manejo seguro de variables de entorno (`.env`) para claves API, incluyendo la configuración de Firebase.

### **Funcionalidades Pendientes (🚧)**

* **Filtrado de Sellos:**

  * 🚧 Implementar una funcionalidad de filtrado para los sellos en la página de gestión, incluyendo una barra de búsqueda por nombre.
* **Gestión de Clientes:**

  * 🚧 Crear una sección/página dedicada a la gestión de clientes.
  * 🚧 Funcionalidades CRUD (Crear, Leer, Actualizar, Eliminar) para clientes.
  * 🚧 Formularios para la entrada y edición de datos de clientes (nombre, dirección, contacto, etc.).
* **Gestión de Facturas:**

  * 🚧 Crear una sección/página dedicada a la gestión de facturas.
  * 🚧 Funcionalidades CRUD (Crear, Leer, Actualizar, Eliminar) para facturas.
  * 🚧 Asociación de facturas a clientes existentes.
  * 🚧 Campos detallados para facturas (fecha, número, productos/servicios, importe, estado, etc.).
* **Mejoras en UI/UX:**

  * 🚧 Implementación de una barra de navegación lateral (Sidebar) más completa.
  * 🚧 Sistema de notificaciones al usuario (ej. `Snackbar` de Material UI).
* **Funcionalidades Adicionales del Perfil:**

  * 🚧 Opción para cambiar la contraseña y/o el email del usuario.

## ⚙️ Configuración Local

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local:

1. **Clonar el Repositorio:**

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd crm-facturas
   ```

   *(Reemplaza `<URL_DEL_REPOSITORIO>` con la URL real de tu repositorio si lo tienes en GitHub/GitLab/etc.)*
2. **Instalar Dependencias:**

   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno:**

   * Crea un archivo `.env` en la raíz del proyecto.
   * Añade tu clave API de Gemini (si la estás usando para alguna funcionalidad específica) y tu configuración de Firebase (si no está ya en `firebase.ts`):

     ```
     VITE_GEMINI_API_KEY=TU_CLAVE_API_AQUI
     # Si necesitas otras variables de Firebase aquí, añádelas
     # VITE_FIREBASE_API_KEY=tu_api_key_firebase
     # VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
     # ...
     ```

     **Importante:** Asegúrate de que `.env` esté en tu `.gitignore` para no subir tu clave API al repositorio.
4. **Iniciar el Servidor de Desarrollo:**

   ```bash
   npm run dev
   ```

   Esto iniciará la aplicación en modo desarrollo, generalmente en `http://localhost:5173`.

## 🚀 Puesta en Producción (Firebase Hosting)

Para desplegar tu aplicación en Firebase Hosting, sigue estos pasos:

1. **Instalar Firebase CLI:**
   Si aún no lo tienes, instala la herramienta de línea de comandos de Firebase globalmente:

   ```bash
   npm install -g firebase-tools
   ```

2. **Iniciar Sesión en Firebase:**
   Abre tu terminal e inicia sesión en tu cuenta de Firebase:

   ```bash
   firebase login
   ```

   Esto abrirá una ventana del navegador para que inicies sesión con tu cuenta de Google.
3. **Inicializar Proyecto Firebase (si no lo has hecho):**
   Si es la primera vez que despliegas este proyecto, inicializa Firebase en la raíz de tu proyecto. Sigue las instrucciones, seleccionando "Hosting" y vinculándolo a tu proyecto de Firebase existente.

   ```bash
   firebase init
   ```

   * Cuando te pregunte "¿What do you want to use as your public directory?", escribe `dist` (que es donde Vite construye la aplicación).
   * Cuando te pregunte "¿Configure as a single-page app (rewrite all urls to /index.html)?", escribe `Yes`.
4. **Construir la Aplicación para Producción:**
   Vite optimizará tu aplicación para el despliegue:

   ```bash
   npm run build
   ```

   Esto creará una carpeta `dist` con los archivos estáticos listos para ser servidos.
5. **Desplegar en Firebase Hosting:**
   Finalmente, despliega tu aplicación:

   ```bash
   firebase deploy --only hosting
   ```

   Una vez completado, Firebase te proporcionará la URL donde tu aplicación está desplegada.

---

¡Espero que este `README.md` sea la guía perfecta para nuestro trabajo futuro!
