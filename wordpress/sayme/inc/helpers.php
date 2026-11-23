<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Valores por defecto de los ajustes (se completan con lo guardado en el panel). */
function sayme_option_defaults() {
	static $d = null;
	if ( null === $d ) {
		$file = SAYME_DIR . '/seed/content.json';
		$j    = is_readable( $file ) ? json_decode( file_get_contents( $file ), true ) : array();
		$d    = isset( $j['options'] ) ? $j['options'] : array();
	}
	return $d;
}

function sayme_opt( $key ) {
	$saved = get_option( 'sayme_options', array() );
	if ( is_array( $saved ) && isset( $saved[ $key ] ) && '' !== $saved[ $key ] ) {
		return $saved[ $key ];
	}
	$d = sayme_option_defaults();
	return isset( $d[ $key ] ) ? $d[ $key ] : '';
}

/** URL de una imagen: ID de la biblioteca, URL completa o ruta dentro del tema. */
function sayme_img( $v ) {
	if ( empty( $v ) ) { return ''; }
	if ( is_numeric( $v ) ) {
		$u = wp_get_attachment_url( (int) $v );
		return $u ? $u : '';
	}
	if ( preg_match( '#^(https?:)?//#', $v ) ) { return $v; }
	return SAYME_URI . '/' . ltrim( $v, '/' );
}

/** Datos estructurados guardados para un contenido. */
function sayme_data( $post_id ) {
	$raw = get_post_meta( $post_id, '_sayme_data', true );
	if ( is_array( $raw ) ) { return $raw; }
	$arr = $raw ? json_decode( $raw, true ) : array();
	return is_array( $arr ) ? $arr : array();
}

function sayme_save_data( $post_id, $data ) {
	update_post_meta( $post_id, '_sayme_data', wp_slash( wp_json_encode( $data, JSON_UNESCAPED_UNICODE ) ) );
}

function sayme_get( $arr, $path, $default = '' ) {
	foreach ( (array) explode( '.', $path ) as $k ) {
		if ( ! is_array( $arr ) || ! isset( $arr[ $k ] ) ) { return $default; }
		$arr = $arr[ $k ];
	}
	return $arr;
}

function sayme_lines( $text ) {
	$out = array();
	foreach ( preg_split( '/\r\n|\r|\n/', (string) $text ) as $l ) {
		$l = trim( $l );
		if ( '' !== $l ) { $out[] = $l; }
	}
	return $out;
}

/** Texto de un solo tramo: *palabra* se resalta con el color de acento. */
function sayme_accent( $text ) {
	$t = esc_html( $text );
	return preg_replace( '/\*([^*]+)\*/u', '<span>$1</span>', $t );
}

/** HTML permitido en textos largos (negritas, saltos de línea, enlaces). */
function sayme_rich( $s ) {
	return wp_kses( (string) $s, array(
		'b' => array(), 'strong' => array(), 'i' => array(), 'em' => array(), 'br' => array(),
		'a' => array( 'href' => true, 'target' => true, 'rel' => true ),
	) );
}

function sayme_services() {
	static $c = null;
	if ( null === $c ) {
		$c = array();
		$q = get_posts( array( 'post_type' => 'servicio', 'numberposts' => -1, 'post_status' => 'publish', 'orderby' => 'menu_order title', 'order' => 'ASC' ) );
		foreach ( $q as $p ) {
			$d = sayme_data( $p->ID );
			$c[] = array( 'id' => $p->ID, 'slug' => $p->post_name, 'url' => get_permalink( $p ), 'label' => $p->post_title, 'data' => $d );
		}
	}
	return $c;
}

function sayme_icon( $key ) {
	$lib = sayme_icon_library();
	return isset( $lib[ $key ] ) ? $lib[ $key ]['svg'] : '';
}

function sayme_projects() {
	static $c = null;
	if ( null === $c ) {
		$c = array();
		$q = get_posts( array( 'post_type' => 'proyecto', 'numberposts' => -1, 'post_status' => 'publish', 'orderby' => 'menu_order title', 'order' => 'ASC' ) );
		foreach ( $q as $p ) {
			$d = sayme_data( $p->ID );
			$d['title'] = $p->post_title;
			$d['key']   = $p->post_name;
			$d['id']    = $p->ID;
			$c[ $p->post_name ] = $d;
		}
	}
	return $c;
}

function sayme_get_clients() {
	$out = array();
	$q = get_posts( array( 'post_type' => 'cliente', 'numberposts' => -1, 'post_status' => 'publish', 'orderby' => 'menu_order title', 'order' => 'ASC' ) );
	foreach ( $q as $p ) {
		$d = sayme_data( $p->ID );
		$out[] = array( 'name' => $p->post_title, 'logo' => isset( $d['logo'] ) ? $d['logo'] : '' );
	}
	return $out;
}

/** URL de una página por su "slug" (por ejemplo, 'nosotros'). */
function sayme_page_url( $slug ) {
	$p = get_page_by_path( $slug );
	return $p ? get_permalink( $p ) : home_url( '/' . $slug . '/' );
}

function sayme_current_scene() {
	if ( is_singular( 'servicio' ) ) {
		$d = sayme_data( get_queried_object_id() );
		return sayme_get( $d, 'hero.scene' );
	}
	return '';
}

/** Tipo de página, según su ubicación o plantilla. */
function sayme_page_kind( $post ) {
	if ( ! $post ) { return 'general'; }
	if ( (int) get_option( 'page_on_front' ) === (int) $post->ID ) { return 'inicio'; }
	if ( 'proyectos' === $post->post_name ) { return 'proyectos'; }
	if ( 'contacto' === $post->post_name ) { return 'contacto'; }
	return 'general';
}
