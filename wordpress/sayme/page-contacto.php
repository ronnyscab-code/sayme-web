<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
sayme_render_header();
the_post();
$d = sayme_data( get_the_ID() );
echo '<main id="main">' . "\n";
sayme_render_phero_simple( sayme_get( $d, 'hero', array() ), get_the_title() );
sayme_render_contact_page( $d );
echo "</main>\n";
sayme_render_footer();
get_footer();
