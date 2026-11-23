<?php
/** Formulario de contacto: recibe el envío de site.js y lo manda por correo. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'rest_api_init', function () {
	register_rest_route( 'sayme/v1', '/contacto', array(
		'methods'             => 'POST',
		'callback'            => 'sayme_handle_contact',
		'permission_callback' => '__return_true',
	) );
} );

function sayme_handle_contact( WP_REST_Request $req ) {
	$p = $req->get_json_params();
	if ( ! is_array( $p ) ) { $p = $req->get_params(); }
	if ( ! empty( $p['web'] ) ) {              /* campo trampa para robots */
		return new WP_REST_Response( array( 'ok' => true ), 200 );
	}
	$nombre  = sanitize_text_field( isset( $p['nombre'] ) ? $p['nombre'] : '' );
	$email   = sanitize_email( isset( $p['email'] ) ? $p['email'] : '' );
	$mensaje = sanitize_textarea_field( isset( $p['mensaje'] ) ? $p['mensaje'] : '' );
	if ( '' === $nombre || ! is_email( $email ) || '' === $mensaje ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'datos' ), 400 );
	}
	/* Límite simple: 5 envíos por hora desde la misma dirección */
	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'x';
	$key = 'sayme_form_' . md5( $ip );
	$n   = (int) get_transient( $key );
	if ( $n >= 5 ) { return new WP_REST_Response( array( 'ok' => false, 'error' => 'limite' ), 429 ); }
	set_transient( $key, $n + 1, HOUR_IN_SECONDS );

	$empresa  = sanitize_text_field( isset( $p['empresa'] ) ? $p['empresa'] : '' );
	$telefono = sanitize_text_field( isset( $p['telefono'] ) ? $p['telefono'] : '' );
	$servicio = sanitize_text_field( isset( $p['servicio'] ) ? $p['servicio'] : '' );

	$to = sayme_opt( 'form_to' ) ?: sayme_opt( 'email' );
	$subject = 'Solicitud de cotización' . ( $servicio ? ': ' . $servicio : '' ) . ' (sitio web)';
	$body = "Nombre: $nombre\nEmpresa: $empresa\nCorreo: $email\nTeléfono: $telefono\nServicio de interés: $servicio\n\nMensaje:\n$mensaje\n";
	$headers = array( 'Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . $nombre . ' <' . $email . '>' );
	$sent = wp_mail( $to, $subject, $body, $headers );
	if ( ! $sent ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'envio' ), 500 );
	}
	return new WP_REST_Response( array( 'ok' => true ), 200 );
}
