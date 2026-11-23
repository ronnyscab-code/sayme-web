<?php
/**
 * Piezas de HTML del sitio. Mantienen el mismo marcado que el diseño original,
 * de modo que styles.css y los scripts 3D funcionan sin cambios.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Marca el enlace de la página actual en el menú. */
function sayme_on( $slug ) {
	return is_page( $slug ) ? ' on' : '';
}

function sayme_e( $s ) { return esc_html( (string) $s ); }

/* ---------- Cabecera y pie ---------- */

function sayme_render_header() {
	$home = home_url( '/' );
	$logo = sayme_img( sayme_opt( 'logo' ) );
	?>
<a class="skip" href="#main">Saltar al contenido</a>
<header class="hdr"><div class="wrap">
  <a class="logo" href="<?php echo esc_url( $home ); ?>" aria-label="SAYME, inicio"><img src="<?php echo esc_url( $logo ); ?>" alt="SAYME" width="204" height="34"></a>
  <button class="burger" id="navToggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav"><i></i><i></i><i></i></button>
  <nav class="nav" id="nav" aria-label="Principal">
    <a class="l" href="<?php echo esc_url( $home ); ?>">Inicio</a>
    <div class="dd"><button type="button" aria-haspopup="true">Especialidades &#9662;</button><div class="menu"><?php
	foreach ( sayme_services() as $s ) {
		echo '<a href="' . esc_url( $s['url'] ) . '">' . sayme_icon( sayme_get( $s['data'], 'card.icon' ) ) . sayme_e( $s['label'] ) . '</a>';
	}
	?></div></div>
    <a class="l<?php echo sayme_on( 'proyectos' ); ?>" href="<?php echo esc_url( sayme_page_url( 'proyectos' ) ); ?>">Proyectos</a>
    <a class="l<?php echo sayme_on( 'nosotros' ); ?>" href="<?php echo esc_url( sayme_page_url( 'nosotros' ) ); ?>">Nosotros</a>
    <a class="l<?php echo sayme_on( 'contacto' ); ?>" href="<?php echo esc_url( sayme_page_url( 'contacto' ) ); ?>">Contacto</a>
    <a class="btn sm" href="<?php echo esc_url( sayme_page_url( 'contacto' ) ); ?>">Cotizar</a>
  </nav>
</div></header>
	<?php
}

function sayme_render_whatsapp_fab() {
	?>
<a class="wa-fab" data-wa="1" href="#" aria-label="Escribir por WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#073b1f" d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.12.55 4.18 1.6 6L4 28l7.1-1.86a12 12 0 0 0 4.94 1.06h.01C22.7 27.2 28 21.8 28 15.16 28 8.5 22.7 3 16.04 3zm0 22.1a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.76.98 1-3.66-.24-.38a9.9 9.9 0 0 1-1.52-5.3c0-5.5 4.48-9.96 9.98-9.96 5.5 0 9.96 4.46 9.96 9.96 0 5.5-4.46 9.95-9.96 9.95zm5.46-7.45c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.9-.8-1.5-1.77-1.67-2.07-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.25-.58-.5-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.3 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35z"/></svg><span>WhatsApp</span></a>
	<?php
}

function sayme_render_footer() {
	$logo = sayme_img( sayme_opt( 'logo' ) );
	$tel  = sayme_opt( 'phone_tel' );
	?>
<footer class="ftr"><div class="wrap">
  <div class="cols">
    <div><img src="<?php echo esc_url( $logo ); ?>" alt="SAYME" width="204" height="34"><p><?php echo sayme_e( sayme_opt( 'footer_text' ) ); ?></p></div>
    <div><h4>Especialidades</h4><?php
	foreach ( sayme_services() as $s ) {
		echo '<a href="' . esc_url( $s['url'] ) . '">' . sayme_e( $s['label'] ) . '</a>';
	}
	?></div>
    <div><h4>Empresa</h4><a href="<?php echo esc_url( sayme_page_url( 'proyectos' ) ); ?>">Proyectos</a><a href="<?php echo esc_url( sayme_page_url( 'nosotros' ) ); ?>">Nosotros</a><a href="<?php echo esc_url( sayme_page_url( 'contacto' ) ); ?>">Contacto</a><a href="<?php echo esc_url( home_url( '/#clientes' ) ); ?>">Clientes</a></div>
    <div><h4>Contacto</h4><a href="mailto:<?php echo esc_attr( sayme_opt( 'email' ) ); ?>"><?php echo sayme_e( sayme_opt( 'email' ) ); ?></a><a href="tel:<?php echo esc_attr( $tel ); ?>"><?php echo sayme_e( sayme_opt( 'phone_label' ) ); ?></a><a data-wa="1" href="#">WhatsApp</a><a data-linkedin href="<?php echo esc_url( sayme_opt( 'linkedin' ) ); ?>">LinkedIn</a><p style="margin-top:8px"><?php echo sayme_e( sayme_opt( 'address' ) ); ?></p></div>
  </div>
  <div class="fine"><span><?php echo sayme_e( sayme_opt( 'copyright' ) ); ?></span><span><?php echo sayme_e( sayme_opt( 'footer_tagline' ) ); ?></span></div>
</div></footer>
	<?php
	sayme_render_whatsapp_fab();
}

/* ---------- Cabeceras de página ---------- */

function sayme_render_phero_simple( $hero, $crumb ) {
	?>
<section class="phero"><div class="wrap" style="grid-template-columns:1fr;min-height:0"><div><p class="crumbs"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Inicio</a> / <?php echo sayme_e( $crumb ); ?></p><h1><?php echo sayme_accent( sayme_get( $hero, 'title' ) ); ?></h1><p class="lead"><?php echo sayme_e( sayme_get( $hero, 'lead' ) ); ?></p></div></div></section>
	<?php
}

function sayme_render_strip( $text ) {
	$rows = sayme_lines( $text );
	if ( ! $rows ) { return; }
	echo '<div class="strip wrap" style="padding:0">';
	foreach ( $rows as $r ) {
		$p = array_map( 'trim', explode( '|', $r, 2 ) );
		echo '<div><b>' . sayme_e( $p[0] ) . '</b><span class="mono">' . sayme_e( isset( $p[1] ) ? $p[1] : '' ) . '</span></div>';
	}
	echo '</div>';
}

function sayme_render_service_hero( $svc ) {
	$d   = $svc['data'];
	$h   = sayme_get( $d, 'hero', array() );
	$q   = rawurlencode( $svc['label'] );
	$ctc = add_query_arg( 'servicio', '', sayme_page_url( 'contacto' ) );
	$ctc = sayme_page_url( 'contacto' ) . '?servicio=' . $q;
	?>
<section class="phero"><div class="wrap">
  <div>
    <p class="crumbs"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Inicio</a> / <a href="<?php echo esc_url( home_url( '/#servicios' ) ); ?>">Especialidades</a> / <?php echo sayme_e( $svc['label'] ); ?></p>
    <h1><?php echo sayme_accent( sayme_get( $h, 'title' ) ); ?></h1>
    <p class="lead"><?php echo sayme_e( sayme_get( $h, 'lead' ) ); ?></p>
    <?php
	$chips = sayme_lines( sayme_get( $h, 'chips' ) );
	if ( $chips ) {
		echo '<div class="chips" style="margin-top:22px">';
		foreach ( $chips as $c ) { echo '<span class="chip">' . sayme_e( $c ) . '</span>'; }
		echo '</div>';
	}
	?>
    <div class="cta"><a class="btn" href="<?php echo esc_url( $ctc ); ?>"><?php echo sayme_e( sayme_get( $h, 'cta_label' ) ); ?></a><a class="btn ghost" data-wa="<?php echo esc_attr( sayme_get( $h, 'wa_text' ) ); ?>" href="#"><?php echo sayme_e( sayme_get( $h, 'wa_label' ) ); ?></a></div>
  </div>
  <div class="art"><canvas data-scene="<?php echo esc_attr( sayme_get( $h, 'scene' ) ); ?>" aria-label="<?php echo esc_attr( sayme_get( $h, 'scene_label' ) ); ?>"></canvas></div>
</div></section>
	<?php
}

/* ---------- Bloques de contenido ---------- */

function sayme_render_table( $text ) {
	$rows = sayme_lines( $text );
	if ( ! $rows ) { return ''; }
	$out = '<table class="spec"><thead><tr>';
	foreach ( explode( '|', array_shift( $rows ) ) as $c ) { $out .= '<th>' . sayme_e( trim( $c ) ) . '</th>'; }
	$out .= '</tr></thead><tbody>';
	foreach ( $rows as $r ) {
		$out .= '<tr>';
		foreach ( explode( '|', $r ) as $c ) { $out .= '<td>' . sayme_e( trim( $c ) ) . '</td>'; }
		$out .= '</tr>';
	}
	return $out . '</tbody></table>';
}

function sayme_render_list( $text ) {
	$l = sayme_lines( $text );
	if ( ! $l ) { return ''; }
	$out = '<ul class="list">';
	foreach ( $l as $i ) { $out .= '<li>' . sayme_rich( $i ) . '</li>'; }
	return $out . '</ul>';
}

function sayme_render_side( $s ) {
	if ( ! is_array( $s ) ) { return ''; }
	$o = '';
	if ( ! empty( $s['heading'] ) ) { $o .= '<h3 style="margin-bottom:10px">' . sayme_e( $s['heading'] ) . '</h3>'; }
	if ( ! empty( $s['badge'] ) ) { $o .= '<span class="badge">' . sayme_e( $s['badge'] ) . '</span>'; }
	if ( ! empty( $s['table'] ) ) { $o .= sayme_render_table( $s['table'] ); }
	if ( ! empty( $s['text'] ) ) { $o .= '<p style="color:var(--body)">' . sayme_rich( $s['text'] ) . '</p>'; }
	if ( ! empty( $s['note'] ) ) { $o .= '<p class="note"' . ( ! empty( $s['badge'] ) ? ' style="margin-top:14px"' : '' ) . '>' . sayme_rich( $s['note'] ) . '</p>'; }
	if ( ! empty( $s['list'] ) ) { $o .= sayme_render_list( $s['list'] ); }
	return $o;
}

function sayme_render_block( $b ) {
	$type = sayme_get( $b, 'type' );
	switch ( $type ) {
		case 'cards':
			$cols = sayme_get( $b, 'cols', 'g3' );
			if ( ! in_array( $cols, array( 'g2', 'g3', 'g4' ), true ) ) { $cols = 'g3'; }
			echo '<div class="grid ' . esc_attr( $cols ) . '">';
			foreach ( (array) sayme_get( $b, 'items', array() ) as $it ) {
				$title = sayme_e( sayme_get( $it, 'title' ) );
				$text  = sayme_get( $it, 'text' );
				$list  = sayme_get( $it, 'list' );
				if ( $list ) {
					echo '<div class="card"><h3>' . $title . '</h3>' . ( $text ? '<p>' . sayme_rich( $text ) . '</p>' : '' ) . sayme_render_list( $list ) . '</div>';
				} else {
					echo '<article class="card">' . sayme_icon( sayme_get( $it, 'icon' ) ) . '<h3>' . $title . '</h3>' . ( $text ? '<p>' . sayme_rich( $text ) . '</p>' : '' ) . '</article>';
				}
			}
			echo '</div>';
			break;
		case 'steps':
			$n = (int) sayme_get( $b, 'n' );
			echo '<div class="steps"' . ( $n > 0 ? ' style="--n:' . $n . '"' : '' ) . '>';
			$i = 0;
			foreach ( (array) sayme_get( $b, 'items', array() ) as $it ) {
				$i++;
				echo '<div class="step"><div class="n">' . sprintf( '%02d', $i ) . '</div><h3>' . sayme_e( sayme_get( $it, 'title' ) ) . '</h3><p>' . sayme_e( sayme_get( $it, 'text' ) ) . '</p></div>';
			}
			echo '</div>';
			break;
		case 'two':
			if ( ! empty( $b['bare'] ) ) {
				$l = sayme_get( $b, 'left', array() ); $rr = sayme_get( $b, 'right', array() );
				echo '<div class="two"><p style="color:var(--body)">' . sayme_rich( sayme_get( $l, 'text' ) ) . '</p>' . sayme_render_list( sayme_get( $rr, 'list' ) ) . '</div>';
				break;
			}
			echo '<div class="two"><div>' . sayme_render_side( sayme_get( $b, 'left' ) ) . '</div><div>' . sayme_render_side( sayme_get( $b, 'right' ) ) . '</div></div>';
			break;
		case 'table':
			echo sayme_render_table( sayme_get( $b, 'rows' ) );
			break;
		case 'note':
			echo '<p class="note">' . sayme_rich( sayme_get( $b, 'text' ) ) . '</p>';
			break;
		case 'flow':
			$nodes = sayme_lines( sayme_get( $b, 'nodes' ) );
			echo '<div class="flow">' . implode( '<div class="ar"></div>', array_map( function ( $n ) { return '<div class="nd">' . sayme_e( $n ) . '</div>'; }, $nodes ) ) . '</div>';
			break;
		case 'certs':
			$cols = sayme_get( $b, 'cols' );
			echo '<div class="certs"' . ( is_string( $cols ) && $cols ? ' style="grid-template-columns:' . esc_attr( $cols ) . '"' : '' ) . '>';
			foreach ( (array) sayme_get( $b, 'items', array() ) as $it ) {
				$img = sayme_img( sayme_get( $it, 'img' ) );
				echo '<div class="cert"><div class="lg">' . ( $img ? '<img src="' . esc_url( $img ) . '" alt="' . esc_attr( sayme_get( $it, 'alt' ) ) . '" loading="lazy">' : '<span class="bv">' . sayme_e( sayme_get( $it, 'badge' ) ) . '</span>' ) . '</div><h3>' . sayme_e( sayme_get( $it, 'title' ) ) . '</h3><p>' . sayme_e( sayme_get( $it, 'text' ) ) . '</p></div>';
			}
			echo '</div>';
			break;
		case 'arch':
			echo '<div class="arch">';
			foreach ( sayme_lines( sayme_get( $b, 'rows' ) ) as $r ) {
				$p = explode( '|', $r, 2 );
				echo '<div class="row"><b>' . sayme_e( trim( $p[0] ) ) . '</b><div>';
				foreach ( explode( ';', isset( $p[1] ) ? $p[1] : '' ) as $t ) {
					if ( '' !== trim( $t ) ) { echo '<span class="tg">' . sayme_e( trim( $t ) ) . '</span>'; }
				}
				echo '</div></div>';
			}
			echo '</div>';
			break;
		case 'fluke':
			echo '<div class="fl"><div class="fscreen"><canvas data-fluke-screen width="800" height="880" aria-label="' . esc_attr( sayme_get( $b, 'aria' ) ) . '"></canvas><span class="mono">' . sayme_e( sayme_get( $b, 'caption' ) ) . '</span></div><div class="two"><div>' . sayme_render_list( sayme_get( $b, 'left' ) ) . '</div><div>' . sayme_render_list( sayme_get( $b, 'right' ) ) . '</div></div></div>';
			break;
		case 'html':
			echo (string) sayme_get( $b, 'html' );
			break;
	}
}

function sayme_render_section( $s ) {
	$alt = ! empty( $s['alt'] );
	echo '<section class="sec' . ( $alt ? ' alt' : '' ) . '"><div class="wrap">' . "\n  ";
	if ( ! empty( $s['kicker'] ) ) { echo '<span class="mono">' . sayme_e( $s['kicker'] ) . '</span>'; }
	if ( ! empty( $s['title'] ) ) { echo '<h2>' . sayme_e( $s['title'] ) . '</h2>'; }
	if ( ! empty( $s['sub'] ) ) { echo '<p class="sub">' . sayme_e( $s['sub'] ) . '</p>'; }
	echo "\n  ";
	foreach ( (array) sayme_get( $s, 'blocks', array() ) as $b ) { sayme_render_block( $b ); }
	echo "\n</div></section>\n";
}

function sayme_render_sections( $sections ) {
	foreach ( (array) $sections as $s ) { sayme_render_section( $s ); }
}

/* ---------- Proyectos ---------- */

function sayme_project_card( $p, $mode ) {
	/* $mode: 'svc' (enlace con inclinación) o 'home' (tarjeta simple) */
	$home = ( 'home' === $mode );
	$img  = sayme_img( $home && ! empty( $p['img_home'] ) ? $p['img_home'] : sayme_get( $p, 'img' ) );
	$kick = $home && ! empty( $p['kicker_home'] ) ? $p['kicker_home'] : sayme_get( $p, 'kicker' );
	$text = $home && ! empty( $p['text_home'] ) ? $p['text_home'] : sayme_get( $p, 'text' );
	$tag  = $home ? 'article' : 'a';
	$attr = $home ? ' class="pc"' : ' class="pc tilt" href="' . esc_url( sayme_page_url( 'proyectos' ) . '#' . $p['key'] ) . '"';
	echo '<' . $tag . $attr . '><div class="im" style="background-image:url(' . esc_url( $img ) . ')" role="img" aria-label="' . esc_attr( sayme_get( $p, 'aria' ) ?: $p['title'] ) . '"><i>' . sayme_e( sayme_get( $p, 'badge' ) ) . '</i></div>';
	echo '<div class="tx"><span class="mono">' . sayme_e( $kick ) . '</span><h3>' . sayme_e( $p['title'] ) . '</h3><p>' . sayme_e( $text ) . '</p></div></' . $tag . '>';
}

function sayme_render_service_refs( $svc ) {
	$d = $svc['data'];
	if ( ! sayme_get( $d, 'show_refs' ) ) { return; }
	$h   = sayme_get( $d, 'refs_head', array() );
	$all = sayme_projects();
	echo '<section class="sec"><div class="wrap">' . "\n  ";
	echo '<span class="mono">' . sayme_e( sayme_get( $h, 'kicker' ) ) . '</span><h2>' . sayme_e( sayme_get( $h, 'title' ) ) . '</h2><p class="sub">' . sayme_e( sayme_get( $h, 'sub' ) ) . '</p>' . "\n  ";
	echo '<div class="pgrid">';
	foreach ( (array) sayme_get( $d, 'refs', array() ) as $key ) {
		if ( isset( $all[ $key ] ) ) { sayme_project_card( $all[ $key ], 'svc' ); }
	}
	echo "</div>\n</div></section>\n";
}

function sayme_render_service_others( $svc ) {
	$d = $svc['data'];
	$h = sayme_get( $d, 'others_head', array() );
	echo '<section class="sec' . ( ! empty( $h['alt'] ) ? ' alt' : '' ) . '"><div class="wrap">' . "\n  ";
	echo '<span class="mono">' . sayme_e( sayme_get( $h, 'kicker' ) ) . '</span><h2>' . sayme_e( sayme_get( $h, 'title' ) ) . '</h2><p class="sub">' . sayme_e( sayme_get( $h, 'sub' ) ) . '</p>' . "\n  ";
	echo '<div class="grid g4">';
	foreach ( sayme_services() as $o ) {
		if ( $o['id'] === $svc['id'] ) { continue; }
		echo '<a class="card" href="' . esc_url( $o['url'] ) . '">' . sayme_icon( sayme_get( $o['data'], 'card.icon' ) ) . '<h3>' . sayme_e( $o['label'] ) . '</h3><span class="more">Ver servicio &rarr;</span></a>';
	}
	echo "</div>\n</div></section>\n";
}

function sayme_render_band( $d ) {
	$b = sayme_get( $d, 'band', array() );
	?>
<section class="cta-band"><div class="wrap">
  <span class="mono" style="color:#8fb3c9"><?php echo sayme_e( sayme_get( $b, 'kicker' ) ); ?></span><h2><?php echo sayme_e( sayme_get( $b, 'title' ) ); ?></h2><p><?php echo sayme_e( sayme_get( $b, 'text' ) ); ?></p>
  <div class="cta"><a class="btn" href="<?php echo esc_url( sayme_page_url( 'contacto' ) ); ?>"><?php echo sayme_e( sayme_get( $b, 'btn1' ) ); ?></a><a class="btn wa" data-wa="<?php echo esc_attr( sayme_get( $b, 'wa' ) ); ?>" href="#"><?php echo sayme_e( sayme_get( $b, 'btn2' ) ); ?></a></div>
</div></section>
	<?php
}

/* Banda final por defecto para las páginas generales */
function sayme_default_band() {
	return array( 'band' => array(
		'kicker' => 'Hablemos', 'title' => '¿Tienes un proyecto en mente?',
		'text' => 'Cuéntanos qué necesitas y te respondemos con una propuesta técnico-económica.',
		'btn1' => 'Solicitar cotización', 'btn2' => 'Escribir por WhatsApp', 'wa' => sayme_opt( 'wa_message' ),
	) );
}

/* ---------- Página de proyectos ---------- */

function sayme_render_projects_page() {
	echo '<section class="sec"><div class="wrap">';
	foreach ( sayme_projects() as $p ) {
		$img = sayme_img( sayme_get( $p, 'img' ) );
		echo '<article class="proj" id="' . esc_attr( $p['key'] ) . '"><div aria-label="' . esc_attr( sayme_get( $p, 'aria' ) ?: $p['title'] ) . '" class="ph" role="img" style="background-image:url(' . esc_url( $img ) . ')"></div><div>';
		echo '<span class="mono">' . sayme_e( sayme_get( $p, 'kicker' ) ) . '</span><h2 style="font-size:2.2rem;margin-top:6px">' . sayme_e( $p['title'] ) . '</h2>';
		if ( ! empty( $p['badge'] ) ) { echo '<div class="tags"><span class="chip">' . sayme_e( $p['badge'] ) . '</span></div>'; }
		echo '<p>' . sayme_e( sayme_get( $p, 'text' ) ) . '</p>' . sayme_render_list( sayme_get( $p, 'bullets' ) );
		echo '</div></article>';
	}
	echo '</div></section>';
}

/* ---------- Contacto ---------- */

function sayme_render_contact_page( $d ) {
	$tel = sayme_opt( 'phone_tel' );
	?>
<section class="sec"><div class="wrap two">
  <form class="cform" id="contactForm" novalidate>
    <div class="r2"><label>Nombre<input autocomplete="name" name="nombre" required></label><label>Empresa<input autocomplete="organization" name="empresa"></label></div>
    <div class="r2"><label>Correo electrónico<input autocomplete="email" name="email" required type="email"></label><label>Teléfono<input autocomplete="tel" name="telefono" type="tel"></label></div>
    <label>Servicio de interés<select name="servicio"><option value="">Selecciona un servicio</option><?php
	foreach ( sayme_service_labels() as $l ) { echo '<option>' . sayme_e( $l ) . '</option>'; }
	?><option>Otro</option></select></label>
    <label>Mensaje<textarea name="mensaje" placeholder="<?php echo esc_attr( sayme_get( $d, 'placeholder' ) ); ?>" required></textarea></label>
    <label aria-hidden="true" class="hp">No completar<input autocomplete="off" name="web" tabindex="-1"></label>
    <div class="fbtn"><button class="btn" type="submit">Enviar solicitud</button><button class="btn wa" id="formWa" type="button">Enviar por WhatsApp</button></div>
    <p aria-live="polite" class="form-status" id="formStatus" role="status"></p>
  </form>
  <div class="info">
    <div><span class="mono">Dirección</span><p class="v"><?php echo sayme_e( sayme_opt( 'address' ) ); ?></p><a class="mono" href="<?php echo esc_url( sayme_opt( 'maps' ) ); ?>" rel="noopener" style="color:var(--accent)" target="_blank">Ver en el mapa →</a></div>
    <div><span class="mono">Correo</span><p class="v"><a href="mailto:<?php echo esc_attr( sayme_opt( 'email' ) ); ?>"><?php echo sayme_e( sayme_opt( 'email' ) ); ?></a></p></div>
    <div><span class="mono">Teléfono y WhatsApp</span><p class="v"><a href="tel:<?php echo esc_attr( $tel ); ?>"><?php echo sayme_e( sayme_opt( 'phone_label' ) ); ?></a></p></div>
    <div><span class="mono"><?php echo sayme_e( sayme_get( $d, 'steps_label' ) ); ?></span><?php echo sayme_render_list( sayme_get( $d, 'steps' ) ); ?></div>
  </div>
</div></section>
	<?php
}


/** Fecha en español: 20 de noviembre de 2026. */
function sayme_fecha_es( $ts ) {
	$m = array( 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' );
	return (int) gmdate( 'j', $ts ) . ' de ' . $m[ (int) gmdate( 'n', $ts ) - 1 ] . ' de ' . gmdate( 'Y', $ts );
}

/** Sección «Novedades» de la portada. No se muestra si está oculta o no hay novedades. */
function sayme_novedades_section( $d ) {
	$nv = sayme_get( $d, 'novedades', array() );
	if ( ! empty( $nv['hide'] ) ) { return; }
	$max = isset( $nv['max'] ) ? (int) $nv['max'] : 6;
	if ( $max < 1 || $max > 12 ) { $max = 6; }
	$posts = get_posts( array( 'post_type' => 'novedad', 'numberposts' => $max, 'post_status' => 'publish', 'orderby' => 'date', 'order' => 'DESC' ) );
	if ( ! $posts ) { return; }
	$tipos = array();
	foreach ( sayme_novedad_tipos() as $t ) { $tipos[ $t[0] ] = $t[1]; }
	$kicker = sayme_get( $nv, 'kicker' ); $title = sayme_get( $nv, 'title' ); $sub = sayme_get( $nv, 'sub' );
	if ( '' === $kicker ) { $kicker = 'Novedades'; }
	if ( '' === $title ) { $title = 'Lo último en *SAYME*'; }
	echo '<section class="blk" id="novedades"><div class="wrap">';
	echo '<span class="mono">' . sayme_e( $kicker ) . '</span><h2>' . sayme_accent( $title ) . '</h2>';
	if ( $sub ) { echo '<p class="sub">' . sayme_e( $sub ) . '</p>'; }
	echo '<div class="ngrid">';
	foreach ( $posts as $i => $p ) {
		$x = sayme_data( $p->ID );
		$tipo = isset( $x['tipo'] ) && isset( $tipos[ $x['tipo'] ] ) ? $x['tipo'] : 'novedad';
		$img = sayme_img( isset( $x['img'] ) ? $x['img'] : '' );
		$link = isset( $x['link'] ) ? esc_url( $x['link'] ) : '';
		$lab = ! empty( $x['link_label'] ) ? $x['link_label'] : 'Ver más';
		echo '<article class="ncard n-' . esc_attr( $tipo ) . ( 0 === $i ? ' n-first' : '' ) . '">';
		if ( $img ) { echo '<div class="nimg"><img src="' . esc_url( $img ) . '" alt="' . esc_attr( $p->post_title ) . '" loading="lazy"></div>'; }
		echo '<div class="nbody"><div class="nmeta"><span class="nbadge">' . sayme_e( $tipos[ $tipo ] ) . '</span><time class="mono" datetime="' . esc_attr( gmdate( 'Y-m-d', strtotime( $p->post_date_gmt ) ) ) . '">' . sayme_e( sayme_fecha_es( strtotime( $p->post_date ) ) ) . '</time></div>';
		echo '<h3>' . sayme_e( $p->post_title ) . '</h3>';
		if ( ! empty( $x['text'] ) ) { echo '<p>' . sayme_e( $x['text'] ) . '</p>'; }
		if ( $link ) { echo '<a class="nlink" href="' . $link . '" target="_blank" rel="noopener">' . sayme_e( $lab ) . ' &rarr;</a>'; }
		echo '</div></article>';
	}
	echo '</div></div></section>' . "\n";
}


/** Banner a todo el ancho con novedades marcadas para el banner. */
function sayme_banner( $d ) {
	$bn = sayme_get( $d, 'banner', array() );
	if ( ! empty( $bn['hide'] ) ) { return; }
	$max = isset( $bn['max'] ) ? (int) $bn['max'] : 5;
	if ( $max < 1 || $max > 8 ) { $max = 5; }
	$posts = get_posts( array( 'post_type' => 'novedad', 'numberposts' => 60, 'post_status' => 'publish', 'orderby' => 'date', 'order' => 'DESC' ) );
	$slides = array();
	foreach ( $posts as $p ) {
		$x = sayme_data( $p->ID );
		if ( ! empty( $x['banner'] ) ) { $slides[] = array( $p, $x ); }
		if ( count( $slides ) >= $max ) { break; }
	}
	if ( ! $slides ) { return; }
	$tipos = array();
	foreach ( sayme_novedad_tipos() as $t ) { $tipos[ $t[0] ] = $t[1]; }
	$n = count( $slides );
	echo '<section class="banner" id="banner" aria-roledescription="carrusel" aria-label="Novedades de SAYME"><div class="bn-track">';
	foreach ( $slides as $i => $s ) {
		list( $p, $x ) = $s;
		$tipo = isset( $x['tipo'] ) && isset( $tipos[ $x['tipo'] ] ) ? $x['tipo'] : 'novedad';
		$img = sayme_img( isset( $x['img'] ) ? $x['img'] : '' );
		$link = isset( $x['link'] ) ? esc_url( $x['link'] ) : '';
		$lab = ! empty( $x['link_label'] ) ? $x['link_label'] : 'Ver más';
		echo '<article class="bn-slide' . ( $img ? '' : ' bn-noimg' ) . '" aria-label="' . esc_attr( ( $i + 1 ) . ' de ' . $n ) . '">';
		if ( $img ) { echo '<img src="' . esc_url( $img ) . '" alt="' . esc_attr( $p->post_title ) . '"' . ( 0 === $i ? '' : ' loading="lazy"' ) . '>'; }
		echo '<div class="bn-shade"></div><div class="bn-text wrap"><span class="nbadge">' . sayme_e( $tipos[ $tipo ] ) . '</span>';
		echo '<h2>' . sayme_e( $p->post_title ) . '</h2>';
		if ( ! empty( $x['text'] ) ) { echo '<p>' . sayme_e( $x['text'] ) . '</p>'; }
		if ( $link ) { echo '<a class="btn" href="' . $link . '" target="_blank" rel="noopener">' . sayme_e( $lab ) . ' &rarr;</a>'; }
		echo '</div></article>';
	}
	echo '</div>';
	if ( $n > 1 ) {
		echo '<button class="bn-nav bn-prev" type="button" aria-label="Anterior">&larr;</button><button class="bn-nav bn-next" type="button" aria-label="Siguiente">&rarr;</button><div class="bn-dots">';
		for ( $i = 0; $i < $n; $i++ ) { echo '<button type="button" aria-label="Ir a la diapositiva ' . ( $i + 1 ) . '"></button>'; }
		echo '</div>';
	}
	echo '</section>' . "\n";
}
