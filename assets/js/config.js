/* ============================================================
   CONFIGURACIÓN DEL SITIO SAYME
   Edita solo este archivo para cambiar datos de contacto,
   el número de WhatsApp y el destino del formulario.
   ============================================================ */
window.SAYME_CONFIG = {
  /* Número de WhatsApp en formato internacional, solo dígitos (56 = Chile, 9 = móvil) */
  whatsapp: '56998951625',

  /* Mensaje que aparece escrito al abrir WhatsApp desde el botón flotante */
  whatsappMensaje: 'Hola SAYME, quisiera cotizar un proyecto.',

  /* Correo que recibe las solicitudes del formulario */
  email: 'sayme@sayme.cl',

  /* Servicio para recibir el formulario sin servidor propio.
     Ejemplo con Formspree: 'https://formspree.io/f/xxxxxxx'
     Si lo dejas vacío, el formulario abre el correo del visitante con el mensaje ya escrito. */
  formEndpoint: ''
};
