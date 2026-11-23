<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Título y descripción para Google, desde los campos del panel. */
function sayme_seo_data() {
	if ( is_singular( array( 'servicio', 'page' ) ) ) {
		$d = sayme_data( get_queried_object_id() );
		return array( 'title' => sayme_get( $d, 'seo_title' ), 'desc' => sayme_get( $d, 'seo_desc' ) );
	}
	return array( 'title' => '', 'desc' => '' );
}

add_filter( 'pre_get_document_title', function ( $title ) {
	$s = sayme_seo_data();
	if ( $s['title'] ) { return $s['title']; }
	if ( is_404() ) { return 'Página no encontrada | SAYME'; }
	return $title;
} );

add_action( 'wp_head', function () {
	$s = sayme_seo_data();
	$title = $s['title'] ?: wp_get_document_title();
	if ( $s['desc'] ) {
		echo '<meta name="description" content="' . esc_attr( $s['desc'] ) . '">' . "\n";
		echo '<meta property="og:description" content="' . esc_attr( $s['desc'] ) . '">' . "\n";
	}
	echo '<meta property="og:title" content="' . esc_attr( $title ) . '">' . "\n";
	echo '<meta property="og:type" content="website">' . "\n";
	echo '<meta property="og:locale" content="es_CL">' . "\n";
	echo '<meta property="og:site_name" content="SAYME">' . "\n";
	if ( is_front_page() ) {
		$ld = array(
			'@context' => 'https://schema.org', '@type' => 'Organization', 'name' => 'SAYME LTDA',
			'url' => home_url( '/' ), 'logo' => sayme_img( sayme_opt( 'logo' ) ),
			'email' => sayme_opt( 'email' ), 'telephone' => sayme_opt( 'phone_tel' ),
			'address' => array( '@type' => 'PostalAddress', 'streetAddress' => sayme_opt( 'address' ), 'addressCountry' => 'CL' ),
			'sameAs' => array_values( array_filter( array( sayme_opt( 'linkedin' ) ) ) ),
		);
		echo '<script type="application/ld+json">' . wp_json_encode( $ld, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
	}
}, 5 );

/* robots.txt limpio (WordPress agrega el sitemap solo) */
add_filter( 'robots_txt', function ( $output, $public ) {
	if ( ! $public ) { return $output; }
	return "User-agent: *\nAllow: /\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n\n" . 'Sitemap: ' . home_url( '/wp-sitemap.xml' ) . "\n";
}, 10, 2 );

/* Oculta la versión de WordPress y la lista de usuarios */
add_filter( 'rest_endpoints', function ( $e ) {
	if ( ! is_user_logged_in() ) {
		unset( $e['/wp/v2/users'], $e['/wp/v2/users/(?P<id>[\d]+)'] );
	}
	return $e;
} );
add_filter( 'wp_sitemaps_add_provider', function ( $provider, $name ) {
	return ( 'users' === $name ) ? false : $provider;
}, 10, 2 );
add_filter( 'xmlrpc_enabled', '__return_false' );
