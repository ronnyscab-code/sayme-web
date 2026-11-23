<?php
/* Página general con secciones editables (también «Nosotros» y las páginas nuevas). */
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
sayme_render_header();
the_post();
$d = sayme_data( get_the_ID() );
echo '<main id="main">' . "\n";
sayme_render_phero_simple( sayme_get( $d, 'hero', array() ), get_the_title() );
sayme_render_strip( sayme_get( $d, 'strip' ) );
sayme_render_sections( sayme_get( $d, 'sections', array() ) );
echo "</main>\n";
sayme_render_band( sayme_get( $d, 'band' ) ? $d : sayme_default_band() );
sayme_render_footer();
get_footer();
