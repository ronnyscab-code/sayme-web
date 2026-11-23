<?php
/**
 * Tema SAYME: configuración general.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'SAYME_VERSION', '1.0.0' );
define( 'SAYME_DIR', get_template_directory() );
define( 'SAYME_URI', get_template_directory_uri() );

require_once SAYME_DIR . '/inc/icons.php';
require_once SAYME_DIR . '/inc/helpers.php';
require_once SAYME_DIR . '/inc/post-types.php';
require_once SAYME_DIR . '/inc/schema.php';
require_once SAYME_DIR . '/inc/render.php';
require_once SAYME_DIR . '/inc/seo.php';
require_once SAYME_DIR . '/inc/contact.php';
require_once SAYME_DIR . '/inc/seed.php';
if ( is_admin() ) {
	require_once SAYME_DIR . '/inc/admin.php';
}

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'html5', array( 'style', 'script' ) );
	add_theme_support( 'post-thumbnails' );
	register_nav_menus( array() );
} );

/* Quita lo que el diseño no usa */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'wp_head', 'wp_generator' );
add_action( 'wp_enqueue_scripts', function () {
	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'global-styles' );
	wp_dequeue_style( 'classic-theme-styles' );
}, 100 );

/* Recursos externos: tipografías, igual que el sitio estático */
add_filter( 'wp_resource_hints', function ( $urls, $relation ) {
	if ( 'preconnect' === $relation ) {
		$urls[] = 'https://fonts.googleapis.com';
		$urls[] = array( 'href' => 'https://fonts.gstatic.com', 'crossorigin' => true );
	}
	return $urls;
}, 10, 2 );

add_action( 'wp_enqueue_scripts', function () {
	$v = SAYME_VERSION;
	wp_enqueue_style( 'sayme-fonts', 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Barlow:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap', array(), null );
	if ( is_front_page() ) {
		wp_enqueue_style( 'sayme-home', SAYME_URI . '/assets/css/home.css', array( 'sayme-fonts' ), $v );
	} else {
		wp_enqueue_style( 'sayme-main', SAYME_URI . '/assets/css/styles.css', array( 'sayme-fonts' ), $v );
	}

	/* Configuración que lee site.js (WhatsApp, correo, formulario, LinkedIn) */
	$cfg = array(
		'whatsapp'        => preg_replace( '/\D/', '', sayme_opt( 'whatsapp' ) ),
		'whatsappMensaje' => sayme_opt( 'wa_message' ),
		'email'           => sayme_opt( 'email' ),
		'formEndpoint'    => rest_url( 'sayme/v1/contacto' ),
		'linkedinUrl'     => sayme_opt( 'linkedin' ),
		'linkedinPortada' => sayme_img( sayme_opt( 'linkedin_cover' ) ),
		'logoUrl'         => sayme_img( sayme_opt( 'logo' ) ),
	);
	wp_register_script( 'sayme-config', false, array(), $v, false );
	wp_enqueue_script( 'sayme-config' );
	wp_add_inline_script( 'sayme-config', 'window.SAYME_CONFIG=' . wp_json_encode( $cfg ) . ';' );

	$deps = array( 'sayme-config' );
	$scene = sayme_current_scene();
	if ( is_front_page() || $scene ) {
		wp_enqueue_script( 'sayme-three', SAYME_URI . '/assets/vendor/three.min.js', array( 'sayme-config' ), $v, true );
	}
	if ( $scene ) {
		wp_enqueue_script( 'sayme-three-common', SAYME_URI . '/assets/js/three-common.js', array( 'sayme-three' ), $v, true );
		$file = ( 'camera' === $scene ) ? 'camera.js' : 'scene-' . $scene . '.js';
		wp_enqueue_script( 'sayme-scene', SAYME_URI . '/assets/js/' . $file, array( 'sayme-three-common' ), $v, true );
	}
	wp_enqueue_script( 'sayme-site', SAYME_URI . '/assets/js/site.js', $deps, $v, true );
	wp_enqueue_script( 'sayme-linkedin', SAYME_URI . '/assets/js/linkedin.js', $deps, $v, true );

	if ( is_front_page() ) {
		$clients = array();
		foreach ( sayme_get_clients() as $c ) {
			$clients[] = array( 'n' => $c['name'], 'i' => $c['logo'] ? sayme_img( $c['logo'] ) : '' );
		}
		wp_enqueue_script( 'sayme-home-scene', SAYME_URI . '/assets/js/home-scene.js', array( 'sayme-three', 'sayme-site' ), $v, true );
		wp_enqueue_script( 'sayme-banner', SAYME_URI . '/assets/js/banner.js', array(), $v, true );
		wp_enqueue_script( 'sayme-home-clients', SAYME_URI . '/assets/js/home-clients.js', array( 'sayme-site' ), $v, true );
		wp_add_inline_script( 'sayme-home-clients', 'window.SAYME_CLIENTS=' . wp_json_encode( $clients ) . ';', 'before' );
	}
} );

/* Los scripts van sin defer/async: el orden importa */
