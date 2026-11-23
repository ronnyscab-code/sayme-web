<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
sayme_render_header();
?>
<main id="main"><section class="sec"><div class="wrap"><span class="mono">Error 404</span><h1>Página no <span>encontrada</span></h1><p class="lead">El enlace no existe o cambió de lugar.</p><div class="cta"><a class="btn" href="<?php echo esc_url( home_url( '/' ) ); ?>">Ir al inicio</a></div></div></section></main>
<?php
sayme_render_footer();
get_footer();
