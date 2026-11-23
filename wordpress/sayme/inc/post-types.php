<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'init', function () {
	register_post_type( 'servicio', array(
		'labels' => array(
			'name' => 'Servicios', 'singular_name' => 'Servicio', 'add_new' => 'Añadir servicio', 'add_new_item' => 'Añadir servicio',
			'edit_item' => 'Editar servicio', 'all_items' => 'Todos los servicios', 'menu_name' => 'Servicios',
		),
		'public' => true, 'has_archive' => 'servicios', 'rewrite' => array( 'slug' => 'servicios', 'with_front' => false ),
		'menu_icon' => 'dashicons-networking', 'menu_position' => 21,
		'supports' => array( 'title', 'page-attributes' ),
		'show_in_rest' => false,
	) );
	register_post_type( 'proyecto', array(
		'labels' => array(
			'name' => 'Proyectos', 'singular_name' => 'Proyecto', 'add_new' => 'Añadir proyecto', 'add_new_item' => 'Añadir proyecto',
			'edit_item' => 'Editar proyecto', 'all_items' => 'Todos los proyectos', 'menu_name' => 'Proyectos',
		),
		'public' => false, 'show_ui' => true, 'publicly_queryable' => false, 'rewrite' => false,
		'menu_icon' => 'dashicons-portfolio', 'menu_position' => 22,
		'supports' => array( 'title', 'page-attributes' ),
		'show_in_rest' => false,
	) );
	register_post_type( 'cliente', array(
		'labels' => array(
			'name' => 'Clientes', 'singular_name' => 'Cliente', 'add_new' => 'Añadir cliente', 'add_new_item' => 'Añadir cliente',
			'edit_item' => 'Editar cliente', 'all_items' => 'Todos los clientes', 'menu_name' => 'Clientes',
		),
		'public' => false, 'show_ui' => true, 'publicly_queryable' => false, 'rewrite' => false,
		'menu_icon' => 'dashicons-groups', 'menu_position' => 23,
		'supports' => array( 'title', 'page-attributes' ),
		'show_in_rest' => false,
	) );
	register_post_type( 'novedad', array(
		'labels' => array(
			'name' => 'Novedades', 'singular_name' => 'Novedad', 'add_new' => 'Añadir novedad', 'add_new_item' => 'Añadir novedad',
			'edit_item' => 'Editar novedad', 'all_items' => 'Todas las novedades', 'menu_name' => 'Novedades',
		),
		'public' => false, 'show_ui' => true, 'publicly_queryable' => false, 'rewrite' => false,
		'menu_icon' => 'dashicons-megaphone', 'menu_position' => 24,
		'supports' => array( 'title' ),
		'show_in_rest' => false,
	) );
} );

/* Edición clásica: los campos propios reemplazan al editor de bloques */
add_filter( 'use_block_editor_for_post_type', function ( $use, $type ) {
	return in_array( $type, array( 'servicio', 'proyecto', 'cliente', 'novedad', 'page' ), true ) ? false : $use;
}, 10, 2 );
add_action( 'init', function () {
	remove_post_type_support( 'page', 'editor' );
	remove_post_type_support( 'page', 'comments' );
	remove_post_type_support( 'page', 'thumbnail' );
}, 20 );

/* /servicios/ lleva a la sección de servicios de la portada */
add_action( 'template_redirect', function () {
	if ( is_post_type_archive( 'servicio' ) ) {
		wp_safe_redirect( home_url( '/#servicios' ), 301 );
		exit;
	}
} );

/* Ajusta la plantilla según el tipo de contenido */
add_filter( 'template_include', function ( $t ) {
	if ( is_front_page() ) {
		$f = locate_template( 'front-page.php' );
		if ( $f ) { return $f; }
	}
	return $t;
} );

/* El sitio no usa entradas, comentarios ni archivos de autor */
add_action( 'admin_menu', function () {
	remove_menu_page( 'edit.php' );
	remove_menu_page( 'edit-comments.php' );
} );
add_filter( 'comments_open', '__return_false' );
add_action( 'template_redirect', function () {
	if ( is_author() || is_date() ) { wp_safe_redirect( home_url( '/' ), 301 ); exit; }
} );
