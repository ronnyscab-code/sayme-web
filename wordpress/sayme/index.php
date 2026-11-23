<?php
/* Plantilla de respaldo: lleva a la portada. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
sayme_render_header();
?>
<main id="main"><section class="sec"><div class="wrap"><h1>Contenido no disponible</h1><p class="lead">Este contenido no existe o cambió de lugar.</p><div class="cta"><a class="btn" href="<?php echo esc_url( home_url( '/' ) ); ?>">Ir al inicio</a></div></div></section></main>
<?php
sayme_render_footer();
get_footer();
