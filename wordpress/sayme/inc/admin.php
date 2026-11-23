<?php
/**
 * Panel de administración: formularios de edición a partir de inc/schema.php.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Qué grupo de campos corresponde a la pantalla de edición actual. */
function sayme_kind_for_post( $post ) {
	switch ( $post->post_type ) {
		case 'servicio': return 'servicio';
		case 'proyecto': return 'proyecto';
		case 'cliente':  return 'cliente';
		case 'novedad':  return 'novedad';
		case 'page':     return sayme_page_kind( $post );
	}
	return '';
}

add_action( 'add_meta_boxes', function () {
	global $post;
	if ( ! $post ) { return; }
	$kind = sayme_kind_for_post( $post );
	if ( ! $kind ) { return; }
	foreach ( sayme_schema( $kind ) as $i => $g ) {
		add_meta_box( 'sayme_' . $g['key'], $g['title'], function () use ( $g ) {
			echo '<div class="sayme-mount" data-group="' . esc_attr( $g['key'] ) . '"></div>';
		}, $post->post_type, 'normal', 'high' );
	}
} );

add_action( 'edit_form_after_title', function ( $post ) {
	$kind = sayme_kind_for_post( $post );
	if ( ! $kind ) { return; }
	wp_nonce_field( 'sayme_save', 'sayme_nonce' );
	echo '<input type="hidden" name="sayme_data_json" id="sayme_data_json" value="">';
	$msgs = array(
		'servicio' => 'Edita el nombre arriba y el contenido en los recuadros de abajo. El orden de los servicios se cambia con «Orden» (a la derecha).',
		'proyecto' => 'Los proyectos marcados en la portada y en cada servicio se eligen en esas páginas.',
		'novedad'  => 'Las novedades se muestran en la sección «Novedades» de la portada, de la más reciente a la más antigua. Para cambiar el orden o programar una, cambia la fecha de publicación.',
		'cliente'  => 'Los clientes aparecen en el carrusel 3D de la portada, ordenados por «Orden».',
		'inicio'   => 'Esta es la portada. Los servicios, proyectos y clientes se editan en sus propios menús.',
		'proyectos'=> 'Los proyectos se editan en el menú «Proyectos».',
		'contacto' => 'Los datos de contacto (teléfono, correo, dirección) se editan en SAYME > Ajustes.',
		'general'  => 'Arma la página con secciones: cada sección tiene un título y uno o más bloques de contenido.',
	);
	if ( isset( $msgs[ $kind ] ) ) {
		echo '<p class="description" style="margin:6px 0 12px;font-size:13px">' . esc_html( $msgs[ $kind ] ) . '</p>';
	}
} );

add_action( 'admin_enqueue_scripts', function ( $hook ) {
	global $post;
	$is_edit = in_array( $hook, array( 'post.php', 'post-new.php' ), true ) && $post && sayme_kind_for_post( $post );
	$is_opts = ( 'toplevel_page_sayme-ajustes' === $hook );
	if ( ! $is_edit && ! $is_opts ) { return; }

	wp_enqueue_media();
	wp_enqueue_style( 'sayme-editor', SAYME_URI . '/admin/editor.css', array(), SAYME_VERSION );
	wp_enqueue_script( 'sayme-editor', SAYME_URI . '/admin/editor.js', array(), SAYME_VERSION, true );

	if ( $is_opts ) {
		$kind  = 'options';
		$state = array();
		foreach ( sayme_schema( 'options' ) as $g ) {
			foreach ( $g['fields'] as $f ) { $state[ $f['key'] ] = sayme_opt( $f['key'] ); }
		}
	} else {
		$kind  = sayme_kind_for_post( $post );
		$state = sayme_data( $post->ID );
	}
	$choices = array( 'proyecto' => array() );
	foreach ( get_posts( array( 'post_type' => 'proyecto', 'numberposts' => -1, 'post_status' => 'any', 'orderby' => 'menu_order title', 'order' => 'ASC' ) ) as $p ) {
		$choices['proyecto'][] = array( $p->post_name, $p->post_title );
	}
	wp_add_inline_script( 'sayme-editor', 'window.SAYME_EDITOR=' . wp_json_encode( array(
		'schema'  => sayme_schema( $kind ),
		'state'   => empty( $state ) ? new stdClass() : $state,
		'choices' => $choices,
		'themeUri'=> SAYME_URI,
		'iconSvg' => array_map( function ( $i ) { return $i['svg']; }, sayme_icon_library() ),
		'target'  => $is_opts ? 'sayme_options_json' : 'sayme_data_json',
	) ) . ';', 'before' );
} );

/* ---------- Guardado ---------- */

function sayme_sanitize_fields( $fields, $data ) {
	$out = array();
	if ( ! is_array( $data ) ) { $data = array(); }
	foreach ( $fields as $f ) {
		$k = isset( $f['data_key'] ) ? $f['data_key'] : $f['key'];
		/* Campos condicionales: solo se guardan si corresponden al tipo elegido */
		if ( ! empty( $f['show_if'] ) ) {
			$ok = true;
			foreach ( $f['show_if'] as $dep => $allowed ) {
				if ( ! isset( $data[ $dep ] ) || ! in_array( $data[ $dep ], $allowed, true ) ) { $ok = false; }
			}
			if ( ! $ok ) { continue; }
		}
		$v = isset( $data[ $k ] ) ? $data[ $k ] : null;
		switch ( $f['type'] ) {
			case 'text':
				$out[ $k ] = is_string( $v ) ? sanitize_text_field( $v ) : '';
				break;
			case 'textarea':
				if ( ! empty( $f['raw'] ) ) {
					$v = is_string( $v ) ? $v : '';
					$out[ $k ] = current_user_can( 'unfiltered_html' ) ? $v : wp_kses_post( $v );
				} else {
					$out[ $k ] = is_string( $v ) ? sanitize_textarea_field( $v ) : '';
				}
				break;
			case 'rich':
				$out[ $k ] = is_string( $v ) ? sayme_rich( str_replace( "\r", '', $v ) ) : '';
				break;
			case 'select':
				$allowed = array_map( function ( $o ) { return $o[0]; }, $f['options'] );
				$out[ $k ] = ( is_string( $v ) && in_array( $v, $allowed, true ) ) ? $v : ( $allowed ? $allowed[0] : '' );
				break;
			case 'checkbox':
				$out[ $k ] = ! empty( $v );
				break;
			case 'image':
				if ( is_numeric( $v ) ) { $out[ $k ] = (int) $v; }
				else { $out[ $k ] = is_string( $v ) ? sanitize_text_field( $v ) : ''; }
				break;
			case 'repeater':
				$rows = array();
				if ( is_array( $v ) ) {
					foreach ( $v as $row ) { $rows[] = sayme_sanitize_fields( $f['fields'], $row ); }
				}
				$out[ $k ] = $rows;
				break;
			case 'group':
				$out[ $k ] = sayme_sanitize_fields( $f['fields'], $v );
				break;
			case 'checklist':
				$out[ $k ] = is_array( $v ) ? array_values( array_map( 'sanitize_title', array_filter( $v, 'is_string' ) ) ) : array();
				break;
		}
	}
	return $out;
}

add_action( 'save_post', function ( $post_id, $post ) {
	if ( ! isset( $_POST['sayme_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['sayme_nonce'] ) ), 'sayme_save' ) ) { return; }
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) { return; }
	if ( ! current_user_can( 'edit_post', $post_id ) ) { return; }
	$kind = sayme_kind_for_post( $post );
	if ( ! $kind || ! isset( $_POST['sayme_data_json'] ) ) { return; }
	$raw  = json_decode( wp_unslash( $_POST['sayme_data_json'] ), true );
	if ( ! is_array( $raw ) ) { return; }
	$clean = array();
	foreach ( sayme_schema( $kind ) as $g ) {
		$clean = array_merge( $clean, sayme_sanitize_fields( $g['fields'], $raw ) );
	}
	sayme_save_data( $post_id, $clean );
}, 10, 2 );

/* ---------- Ajustes generales ---------- */

add_action( 'admin_menu', function () {
	add_menu_page( 'Ajustes SAYME', 'SAYME', 'manage_options', 'sayme-ajustes', 'sayme_options_page', 'dashicons-admin-generic', 20 );
} );

function sayme_options_page() {
	if ( ! current_user_can( 'manage_options' ) ) { return; }
	$msg = '';
	if ( isset( $_POST['sayme_options_json'] ) && check_admin_referer( 'sayme_options_save', 'sayme_options_nonce' ) ) {
		$raw = json_decode( wp_unslash( $_POST['sayme_options_json'] ), true );
		if ( is_array( $raw ) ) {
			$clean = array();
			foreach ( sayme_schema( 'options' ) as $g ) { $clean = array_merge( $clean, sayme_sanitize_fields( $g['fields'], $raw ) ); }
			update_option( 'sayme_options', $clean );
			$msg = '<div class="notice notice-success"><p>Ajustes guardados.</p></div>';
		}
	}
	if ( isset( $_POST['sayme_seed_action'] ) && check_admin_referer( 'sayme_seed', 'sayme_seed_nonce' ) ) {
		$over = ( 'overwrite' === $_POST['sayme_seed_action'] );
		$r    = sayme_import_seed( $over );
		flush_rewrite_rules();
		$msg  = '<div class="notice notice-success"><p>Contenido inicial cargado. Creados: ' . (int) $r['creados'] . ', actualizados: ' . (int) $r['actualizados'] . ', sin cambios: ' . (int) $r['omitidos'] . '.</p></div>';
	}
	echo '<div class="wrap"><h1>Ajustes de SAYME</h1>' . $msg; // phpcs:ignore
	echo '<p class="description">Datos que se repiten en todo el sitio: contacto, WhatsApp, redes, pie de página y logos.</p>';
	echo '<form method="post">';
	wp_nonce_field( 'sayme_options_save', 'sayme_options_nonce' );
	echo '<input type="hidden" name="sayme_options_json" id="sayme_options_json" value=""><div id="sayme-options-mounts">';
	foreach ( sayme_schema( 'options' ) as $g ) {
		echo '<div class="postbox"><h2 class="hndle" style="padding:10px 14px"><span>' . esc_html( $g['title'] ) . '</span></h2><div class="inside"><div class="sayme-mount" data-group="' . esc_attr( $g['key'] ) . '"></div></div></div>';
	}
	echo '</div>';
	submit_button( 'Guardar ajustes' );
	echo '</form>';

	echo '<hr><h2>Contenido inicial</h2><p>Carga los textos originales del sitio (páginas, servicios, proyectos y clientes). «Crear lo que falta» no toca lo que ya editaste; «Restaurar todo» reemplaza los textos por los originales.</p>';
	echo '<form method="post" style="display:flex;gap:10px">';
	wp_nonce_field( 'sayme_seed', 'sayme_seed_nonce' );
	echo '<button class="button" name="sayme_seed_action" value="missing">Crear lo que falta</button>';
	echo '<button class="button button-secondary" name="sayme_seed_action" value="overwrite" onclick="return confirm(\'Esto reemplaza los textos editados por los originales. ¿Continuar?\')">Restaurar todo</button>';
	echo '</form></div>';
}
