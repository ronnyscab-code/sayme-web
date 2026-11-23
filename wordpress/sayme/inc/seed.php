<?php
/**
 * Contenido inicial: crea las páginas, servicios, proyectos y clientes del sitio con los textos actuales.
 * Se ejecuta una sola vez al activar el tema. Desde SAYME > Ajustes se puede repetir.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function sayme_seed_file() {
	$f = SAYME_DIR . '/seed/content.json';
	return is_readable( $f ) ? json_decode( file_get_contents( $f ), true ) : array();
}

/**
 * @param bool $overwrite Si es true, reemplaza los textos de los contenidos que ya existen.
 * @return array Resumen de lo creado y lo actualizado.
 */
function sayme_import_seed( $overwrite = false ) {
	$seed = sayme_seed_file();
	if ( ! $seed ) { return array( 'error' => 'No se encontró seed/content.json' ); }
	$log = array( 'creados' => 0, 'actualizados' => 0, 'omitidos' => 0 );

	$upsert = function ( $type, $slug, $title, $order, $data ) use ( &$log, $overwrite ) {
		$existing = get_posts( array( 'post_type' => $type, 'name' => $slug, 'post_status' => 'any', 'numberposts' => 1 ) );
		if ( $existing ) {
			$id = $existing[0]->ID;
			if ( ! $overwrite ) { $log['omitidos']++; return $id; }
			wp_update_post( array( 'ID' => $id, 'post_title' => $title, 'menu_order' => $order ) );
			$log['actualizados']++;
		} else {
			$id = wp_insert_post( array( 'post_type' => $type, 'post_name' => $slug, 'post_title' => $title, 'post_status' => 'publish', 'menu_order' => $order ) );
			$log['creados']++;
		}
		if ( $id && ! is_wp_error( $id ) ) { sayme_save_data( $id, $data ); }
		return $id;
	};

	foreach ( $seed['projects'] as $p ) { $upsert( 'proyecto', $p['slug'], $p['title'], $p['order'], $p['data'] ); }
	foreach ( $seed['clientes'] as $c ) { $upsert( 'cliente', sanitize_title( $c['title'] ), $c['title'], $c['order'], $c['data'] ); }
	foreach ( $seed['services'] as $s ) { $upsert( 'servicio', $s['slug'], $s['title'], $s['order'], $s['data'] ); }
	foreach ( $seed['pages'] as $pg ) {
		$id = $upsert( 'page', $pg['slug'], $pg['title'], 0, $pg['data'] );
		if ( $id && ! empty( $pg['front'] ) ) {
			update_option( 'show_on_front', 'page' );
			update_option( 'page_on_front', $id );
		}
	}
	return $log;
}

/* Al activar el tema: permalinks "nombre de la entrada" y contenido inicial (solo la primera vez) */
add_action( 'after_switch_theme', function () {
	global $wp_rewrite;
	if ( ! get_option( 'sayme_seeded' ) ) {
		sayme_import_seed( false );
		update_option( 'sayme_seeded', 1 );
	}
	if ( ! get_option( 'permalink_structure' ) ) {
		$wp_rewrite->set_permalink_structure( '/%postname%/' );
	}
	flush_rewrite_rules();
} );
