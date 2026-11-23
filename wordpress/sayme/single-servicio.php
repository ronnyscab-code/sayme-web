<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
sayme_render_header();
the_post();
$svc = null;
foreach ( sayme_services() as $s ) {
	if ( $s['id'] === get_the_ID() ) { $svc = $s; break; }
}
if ( ! $svc ) {
	$svc = array( 'id' => get_the_ID(), 'slug' => get_post_field( 'post_name' ), 'url' => get_permalink(), 'label' => get_the_title(), 'data' => sayme_data( get_the_ID() ) );
}
$d = $svc['data'];
echo '<main id="main">' . "\n";
sayme_render_service_hero( $svc );
sayme_render_sections( sayme_get( $d, 'sections', array() ) );
sayme_render_service_refs( $svc );
sayme_render_service_others( $svc );
echo "</main>\n";
sayme_render_band( $d );
sayme_render_footer();
get_footer();
