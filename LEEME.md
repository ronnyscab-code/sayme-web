# Sitio web SAYME LTDA

Sitio estático (HTML + CSS + JS). No requiere base de datos ni compilar nada.

## Publicar
1. Sube TODO el contenido de esta carpeta a la raíz pública del servidor (public_html, www, htdocs).
2. Edita `assets/js/config.js`:
   - `whatsapp`: número en formato internacional sin "+" (ej. 56998951625)
   - `email`: correo de contacto
   - `formEndpoint`: URL de un servicio de formularios (ej. Formspree: https://formspree.io/f/xxxx).
     Si queda vacío, el formulario abre el correo del cliente (mailto) y el botón de WhatsApp envía el mensaje armado.
3. En `sitemap.xml` y `robots.txt` el dominio es https://sayme.cl; cámbialo si es otro.
4. `.htaccess` sirve para Apache (compresión, caché, 404). En Nginx, replica esas reglas en el server block.

## Páginas
index, fibra-optica, redes-de-datos, infraestructura-canalizacion, cctv-seguridad, redes-cisco, wifi,
control-de-acceso, equipamiento-ti, proyectos, nosotros, contacto, 404.

## Objetos 3D (Three.js local, sin internet)
assets/js/: cable.js, camera.js, scene-*.js (uno por servicio) y ring.js (carrusel de clientes).
Respetan "reducir movimiento" del sistema y se pausan fuera de pantalla.

## Colores
Navy #1f3a5f, Teal #0f9688, Slate #6b7a8c (propuesta técnica). Logo SAYME sin modificar.

## Verlo en tu Mac
Descomprime el ZIP, abre Terminal, entra a la carpeta (`cd ruta/sayme-sitio`) y ejecuta `python3 -m http.server 8000`.
Luego abre http://localhost:8000 en Chrome o Safari. (Abrir index.html con doble clic funciona casi todo, pero un servidor local es más fiel.)
