<?php
/**
 * Definición de los campos editables. El panel de administración (admin/editor.js)
 * dibuja los formularios a partir de estas listas.
 * Tipos: text, textarea, rich (admite negrita, saltos y enlaces), select, checkbox, image, repeater, group, checklist.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function sayme_f( $key, $type, $label, $extra = array() ) {
	return array_merge( array( 'key' => $key, 'type' => $type, 'label' => $label ), $extra );
}

function sayme_novedad_tipos() {
	return array( array( 'novedad', 'Novedad' ), array( 'equipo', 'Equipo' ), array( 'importante', 'Información importante' ), array( 'curioso', 'Dato curioso' ) );
}

function sayme_icon_options() {
	$o = array( array( '', 'Sin icono' ) );
	foreach ( sayme_icon_library() as $k => $i ) {
		$o[] = array( $k, 'Icono: ' . $i['label'] );
	}
	return $o;
}

function sayme_scene_options() {
	return array(
		array( 'fusion', 'Fusionadora de fibra óptica' ), array( 'fluke', 'Certificador Fluke' ), array( 'canal', 'Canalización' ),
		array( 'camera', 'Cámara CCTV' ), array( 'lab', 'Laboratorio de red' ), array( 'wifi', 'WiFi' ),
		array( 'acceso', 'Control de acceso' ), array( 'equipo', 'Equipamiento TI' ),
	);
}

function sayme_side_fields() {
	return array(
		sayme_f( 'heading', 'text', 'Título pequeño (opcional)' ),
		sayme_f( 'badge', 'text', 'Distintivo (opcional)' ),
		sayme_f( 'table', 'textarea', 'Tabla (opcional)', array( 'help' => 'Una fila por línea; columnas separadas con |. La primera línea es el encabezado.', 'rows' => 4 ) ),
		sayme_f( 'text', 'rich', 'Párrafo (opcional)', array( 'rows' => 4 ) ),
		sayme_f( 'note', 'rich', 'Nota (opcional)', array( 'rows' => 2 ) ),
		sayme_f( 'list', 'rich', 'Lista de puntos (opcional)', array( 'help' => 'Un punto por línea.', 'rows' => 5 ) ),
	);
}

/** Campos de un bloque dentro de una sección. */
function sayme_block_fields() {
	return array(
		sayme_f( 'type', 'select', 'Tipo de bloque', array( 'options' => array(
			array( 'cards', 'Tarjetas' ), array( 'steps', 'Pasos numerados' ), array( 'two', 'Dos columnas' ),
			array( 'table', 'Tabla' ), array( 'note', 'Nota' ), array( 'flow', 'Flujo de etapas' ),
			array( 'certs', 'Certificaciones' ), array( 'arch', 'Arquitectura (filas con etiquetas)' ),
			array( 'fluke', 'Pantalla del certificador (3D) + listas' ), array( 'html', 'HTML libre (avanzado)' ),
		) ) ),
		sayme_f( 'cols', 'select', 'Columnas', array( 'show_if' => array( 'type' => array( 'cards' ) ), 'options' => array(
			array( 'g2', '2 columnas' ), array( 'g3', '3 columnas' ), array( 'g4', '4 columnas' ),
		) ) ),
		sayme_f( 'items', 'repeater', 'Tarjetas', array( 'show_if' => array( 'type' => array( 'cards' ) ), 'item_label' => 'title', 'fields' => array(
			sayme_f( 'icon', 'select', 'Icono', array( 'options' => sayme_icon_options() ) ),
			sayme_f( 'title', 'text', 'Título' ),
			sayme_f( 'text', 'rich', 'Texto', array( 'rows' => 3 ) ),
			sayme_f( 'list', 'rich', 'Lista de puntos (opcional)', array( 'help' => 'Un punto por línea.', 'rows' => 4 ) ),
		) ) ),
		sayme_f( 'n', 'text', 'Cantidad de pasos por fila (opcional)', array( 'show_if' => array( 'type' => array( 'steps' ) ), 'help' => 'Déjalo vacío para usar 3. Para 5 pasos, escribe 5.' ) ),
		sayme_f( 'steps', 'repeater', 'Pasos', array( 'data_key' => 'items', 'show_if' => array( 'type' => array( 'steps' ) ), 'item_label' => 'title', 'fields' => array(
			sayme_f( 'title', 'text', 'Título' ),
			sayme_f( 'text', 'textarea', 'Texto', array( 'rows' => 2 ) ),
		) ) ),
		sayme_f( 'bare', 'checkbox', 'Sin contenedores (texto a la izquierda y lista a la derecha, como en el diseño original de «Nosotros»)', array( 'show_if' => array( 'type' => array( 'two' ) ) ) ),
		sayme_f( 'left', 'group', 'Columna izquierda', array( 'show_if' => array( 'type' => array( 'two' ) ), 'fields' => sayme_side_fields() ) ),
		sayme_f( 'right', 'group', 'Columna derecha', array( 'show_if' => array( 'type' => array( 'two' ) ), 'fields' => sayme_side_fields() ) ),
		sayme_f( 'rows', 'textarea', 'Filas de la tabla', array( 'show_if' => array( 'type' => array( 'table' ) ), 'help' => 'Una fila por línea; columnas separadas con |. La primera línea es el encabezado.', 'rows' => 5 ) ),
		sayme_f( 'text', 'rich', 'Texto de la nota', array( 'show_if' => array( 'type' => array( 'note' ) ), 'rows' => 2 ) ),
		sayme_f( 'nodes', 'textarea', 'Etapas del flujo', array( 'show_if' => array( 'type' => array( 'flow' ) ), 'help' => 'Una etapa por línea.', 'rows' => 5 ) ),
		sayme_f( 'cert_cols', 'text', 'Ancho de columnas (avanzado, opcional)', array( 'data_key' => 'cols', 'show_if' => array( 'type' => array( 'certs' ) ), 'help' => 'Déjalo vacío si no sabes qué poner.' ) ),
		sayme_f( 'certs', 'repeater', 'Certificaciones', array( 'data_key' => 'items', 'show_if' => array( 'type' => array( 'certs' ) ), 'item_label' => 'title', 'fields' => array(
			sayme_f( 'img', 'image', 'Logo o imagen' ),
			sayme_f( 'alt', 'text', 'Texto alternativo de la imagen' ),
			sayme_f( 'badge', 'text', 'Texto en lugar de imagen (opcional)', array( 'help' => 'Si no hay imagen, se muestra este texto como logo.' ) ),
			sayme_f( 'title', 'text', 'Título' ),
			sayme_f( 'text', 'textarea', 'Descripción', array( 'rows' => 3 ) ),
		) ) ),
		sayme_f( 'arch_rows', 'textarea', 'Filas', array( 'data_key' => 'rows', 'show_if' => array( 'type' => array( 'arch' ) ), 'help' => 'Una fila por línea: Título | etiqueta 1 ; etiqueta 2 ; etiqueta 3', 'rows' => 6 ) ),
		sayme_f( 'fl_left', 'textarea', 'Lista izquierda', array( 'data_key' => 'left', 'show_if' => array( 'type' => array( 'fluke' ) ), 'help' => 'Un punto por línea.', 'rows' => 4 ) ),
		sayme_f( 'fl_right', 'textarea', 'Lista derecha', array( 'data_key' => 'right', 'show_if' => array( 'type' => array( 'fluke' ) ), 'help' => 'Un punto por línea.', 'rows' => 4 ) ),
		sayme_f( 'caption', 'text', 'Rótulo bajo la pantalla', array( 'show_if' => array( 'type' => array( 'fluke' ) ) ) ),
		sayme_f( 'aria', 'text', 'Descripción para accesibilidad', array( 'show_if' => array( 'type' => array( 'fluke' ) ) ) ),
		sayme_f( 'html', 'textarea', 'Código HTML', array( 'raw' => true, 'show_if' => array( 'type' => array( 'html' ) ), 'help' => 'Solo para personal técnico.', 'rows' => 8 ) ),
	);
}

function sayme_section_fields() {
	return array(
		sayme_f( 'kicker', 'text', 'Rótulo pequeño (sobre el título)' ),
		sayme_f( 'title', 'text', 'Título de la sección' ),
		sayme_f( 'sub', 'textarea', 'Bajada (texto bajo el título)', array( 'rows' => 2 ) ),
		sayme_f( 'alt', 'checkbox', 'Fondo alternativo (gris azulado)' ),
		sayme_f( 'blocks', 'repeater', 'Contenido de la sección', array( 'item_label' => 'type', 'fields' => sayme_block_fields() ) ),
	);
}

function sayme_seo_fields() {
	return array(
		sayme_f( 'seo_title', 'text', 'Título para Google', array( 'help' => 'Aparece en la pestaña del navegador y en los resultados de búsqueda.' ) ),
		sayme_f( 'seo_desc', 'textarea', 'Descripción para Google', array( 'rows' => 3, 'help' => 'Entre 120 y 160 caracteres.' ) ),
	);
}

function sayme_hero_simple_fields() {
	return array(
		sayme_f( 'title', 'text', 'Título principal', array( 'help' => 'Rodea con *asteriscos* las palabras que van en color. Ejemplo: Identidad y *trayectoria*' ) ),
		sayme_f( 'lead', 'textarea', 'Texto de apoyo', array( 'rows' => 3 ) ),
	);
}

/** Grupos de campos por tipo de contenido. */
function sayme_schema( $kind ) {
	switch ( $kind ) {
		case 'servicio':
			return array(
				array( 'key' => 'card', 'title' => 'Menú y tarjeta de la portada', 'fields' => array( sayme_f( 'card', 'group', 'Menú y tarjeta', array( 'fields' => array(
					sayme_f( 'icon', 'select', 'Icono (menú y tarjetas)', array( 'options' => sayme_icon_options() ) ),
					sayme_f( 'home_text', 'textarea', 'Texto de la tarjeta en la portada', array( 'rows' => 2 ) ),
					sayme_f( 'home_tag', 'text', 'Etiqueta bajo el texto (portada)', array( 'help' => 'Ejemplo: OS2 · OM3 · OM4' ) ),
					sayme_f( 'home_color', 'select', 'Color de la tarjeta', array( 'options' => array( array( 'navy', 'Azul marino' ), array( 'teal', 'Verde azulado' ), array( 'slate', 'Gris pizarra' ) ) ) ),
					sayme_f( 'home_title', 'text', 'Título de la tarjeta en la portada (si es distinto del nombre)' ),
					sayme_f( 'footer_label', 'text', 'Nombre corto en el pie de la portada (opcional)', array( 'help' => 'Si lo dejas vacío, este servicio no aparece en esa línea del pie.' ) ),
				) ) ) ) ),
				array( 'key' => 'hero', 'title' => 'Cabecera de la página', 'fields' => array( sayme_f( 'hero', 'group', 'Cabecera', array( 'fields' => array(
					sayme_f( 'title', 'text', 'Título principal', array( 'help' => 'Rodea con *asteriscos* las palabras que van en color. Ejemplo: Fibra óptica *certificada*' ) ),
					sayme_f( 'lead', 'textarea', 'Texto de apoyo', array( 'rows' => 3 ) ),
					sayme_f( 'chips', 'textarea', 'Etiquetas', array( 'rows' => 3, 'help' => 'Una por línea.' ) ),
					sayme_f( 'cta_label', 'text', 'Texto del botón de cotizar' ),
					sayme_f( 'wa_label', 'text', 'Texto del botón de WhatsApp' ),
					sayme_f( 'wa_text', 'text', 'Mensaje que se escribe en WhatsApp' ),
					sayme_f( 'scene', 'select', 'Objeto 3D de la cabecera', array( 'options' => sayme_scene_options(), 'help' => 'El modelo 3D es parte del diseño; normalmente no se cambia.' ) ),
					sayme_f( 'scene_label', 'text', 'Descripción del objeto 3D (accesibilidad)' ),
				) ) ) ) ),
				array( 'key' => 'sections', 'title' => 'Secciones de la página', 'fields' => array(
					sayme_f( 'sections', 'repeater', 'Secciones', array( 'item_label' => 'title', 'fields' => sayme_section_fields() ) ),
				) ),
				array( 'key' => 'refs', 'title' => 'Proyectos de referencia y otras especialidades', 'fields' => array(
					sayme_f( 'show_refs', 'checkbox', 'Mostrar la sección «Proyectos donde lo aplicamos»' ),
					sayme_f( 'refs_head', 'group', 'Encabezado de proyectos', array( 'fields' => array(
						sayme_f( 'kicker', 'text', 'Rótulo pequeño' ), sayme_f( 'title', 'text', 'Título' ), sayme_f( 'sub', 'text', 'Bajada' ),
					) ) ),
					sayme_f( 'refs', 'checklist', 'Proyectos que se muestran', array( 'source' => 'proyecto' ) ),
					sayme_f( 'others_head', 'group', 'Encabezado de «Otras especialidades»', array( 'fields' => array(
						sayme_f( 'kicker', 'text', 'Rótulo pequeño' ), sayme_f( 'title', 'text', 'Título' ), sayme_f( 'sub', 'text', 'Bajada' ),
						sayme_f( 'alt', 'checkbox', 'Fondo alternativo' ),
					) ) ),
				) ),
				array( 'key' => 'band', 'title' => 'Banda final («Hablemos»)', 'fields' => array(
					sayme_f( 'band', 'group', 'Banda final', array( 'fields' => array(
						sayme_f( 'kicker', 'text', 'Rótulo pequeño' ), sayme_f( 'title', 'text', 'Título' ), sayme_f( 'text', 'textarea', 'Texto', array( 'rows' => 2 ) ),
						sayme_f( 'btn1', 'text', 'Texto del botón 1' ), sayme_f( 'btn2', 'text', 'Texto del botón de WhatsApp' ), sayme_f( 'wa', 'text', 'Mensaje de WhatsApp' ),
					) ) ),
				) ),
				array( 'key' => 'seo', 'title' => 'Google (SEO)', 'fields' => sayme_seo_fields() ),
			);

		case 'proyecto':
			return array(
				array( 'key' => 'main', 'title' => 'Datos del proyecto', 'fields' => array(
					sayme_f( 'kicker', 'text', 'Cliente y período', array( 'help' => 'Ejemplo: Nuevo Pudahuel · 2017 a hoy' ) ),
					sayme_f( 'badge', 'text', 'Etiqueta destacada', array( 'help' => 'Ejemplo: 40 enlaces' ) ),
					sayme_f( 'text', 'textarea', 'Descripción (página Proyectos y fichas de servicios)', array( 'rows' => 3 ) ),
					sayme_f( 'bullets', 'textarea', 'Alcance (lista de puntos)', array( 'rows' => 5, 'help' => 'Un punto por línea.' ) ),
					sayme_f( 'img', 'image', 'Foto del proyecto' ),
					sayme_f( 'aria', 'text', 'Descripción de la foto (accesibilidad)' ),
				) ),
				array( 'key' => 'home', 'title' => 'Versión para la portada (opcional)', 'fields' => array(
					sayme_f( 'kicker_home', 'text', 'Cliente y período en la portada', array( 'help' => 'Déjalo vacío para usar el mismo de arriba.' ) ),
					sayme_f( 'text_home', 'textarea', 'Descripción en la portada', array( 'rows' => 3, 'help' => 'Déjalo vacío para usar la misma de arriba.' ) ),
					sayme_f( 'img_home', 'image', 'Foto en la portada', array( 'help' => 'Déjalo vacío para usar la misma de arriba.' ) ),
				) ),
			);

		case 'cliente':
			return array(
				array( 'key' => 'main', 'title' => 'Logo del cliente', 'fields' => array(
					sayme_f( 'logo', 'image', 'Logo', array( 'help' => 'Opcional. Si no hay logo, se muestra el nombre. Usa solo logos autorizados por el cliente.' ) ),
				) ),
			);

		case 'novedad':
			return array(
				array( 'key' => 'main', 'title' => 'Contenido de la novedad', 'fields' => array(
					sayme_f( 'tipo', 'select', 'Tipo', array( 'options' => sayme_novedad_tipos() ) ),
					sayme_f( 'banner', 'checkbox', 'Mostrar en el banner grande de la portada', array( 'help' => 'Para que se vea bien, agrega una foto horizontal (ideal 1920 × 800 px).' ) ),
					sayme_f( 'text', 'textarea', 'Texto', array( 'rows' => 4, 'help' => 'Breve: 2 o 3 frases se ven mejor.' ) ),
					sayme_f( 'img', 'image', 'Foto o imagen', array( 'help' => 'Opcional. Mejor horizontal (formato 4:3 o 16:9). Para fotos del equipo, usa solo fotos con autorización de las personas.' ) ),
					sayme_f( 'link', 'text', 'Enlace (opcional)', array( 'help' => 'Dirección completa, por ejemplo https://www.linkedin.com/...' ) ),
					sayme_f( 'link_label', 'text', 'Texto del enlace', array( 'help' => 'Por defecto: Ver más.' ) ),
				) ),
			);

		case 'inicio':
			return array(
				array( 'key' => 'hero', 'title' => 'Portada: cabecera', 'fields' => array(
					sayme_f( 'hero', 'group', 'Cabecera', array( 'fields' => array(
						sayme_f( 'kicker', 'text', 'Rótulo pequeño' ),
						sayme_f( 'title', 'text', 'Título principal', array( 'help' => 'Rodea con *asteriscos* las palabras que van en color.' ) ),
						sayme_f( 'lead', 'textarea', 'Texto de apoyo', array( 'rows' => 3 ) ),
						sayme_f( 'btn1', 'text', 'Texto del botón principal' ), sayme_f( 'btn2', 'text', 'Texto del segundo botón' ),
					) ) ),
					sayme_f( 'banner', 'group', 'Banner de novedades', array( 'fields' => array(
						sayme_f( 'hide', 'checkbox', 'Ocultar el banner' ),
						sayme_f( 'max', 'text', 'Cuántas diapositivas mostrar', array( 'help' => 'Número entre 1 y 8. Por defecto 5. Se muestran las novedades marcadas «Mostrar en el banner».' ) ),
					) ) ),
				) ),
				array( 'key' => 'servicios', 'title' => 'Portada: servicios', 'fields' => array(
					sayme_f( 'servicios', 'group', 'Servicios', array( 'fields' => array(
						sayme_f( 'kicker', 'text', 'Rótulo pequeño' ), sayme_f( 'title', 'text', 'Título' ), sayme_f( 'sub', 'textarea', 'Bajada', array( 'rows' => 2 ) ),
						sayme_f( 'foot', 'textarea', 'Texto al pie de las tarjetas', array( 'rows' => 2 ) ),
					) ) ),
				) ),
				array( 'key' => 'soluciones', 'title' => 'Portada: soluciones', 'fields' => array(
					sayme_f( 'soluciones', 'group', 'Soluciones', array( 'fields' => array(
						sayme_f( 'kicker', 'text', 'Rótulo pequeño' ), sayme_f( 'title', 'text', 'Título' ), sayme_f( 'sub', 'textarea', 'Bajada', array( 'rows' => 2 ) ),
						sayme_f( 'items', 'repeater', 'Etapas', array( 'item_label' => 'title', 'fields' => array(
							sayme_f( 'title', 'text', 'Título' ), sayme_f( 'text', 'textarea', 'Texto', array( 'rows' => 2 ) ),
						) ) ),
					) ) ),
				) ),
				array( 'key' => 'nosotros', 'title' => 'Portada: nosotros y sectores', 'fields' => array(
					sayme_f( 'nosotros', 'group', 'Nosotros y sectores', array( 'fields' => array(
						sayme_f( 'kicker', 'text', 'Rótulo (columna izquierda)' ), sayme_f( 'title', 'text', 'Título (columna izquierda)' ),
						sayme_f( 'list', 'rich', 'Razones para elegir a SAYME', array( 'rows' => 5, 'help' => 'Una por línea.' ) ),
						sayme_f( 'kicker2', 'text', 'Rótulo (columna derecha)' ), sayme_f( 'title2', 'text', 'Título (columna derecha)' ),
						sayme_f( 'sectors', 'textarea', 'Sectores', array( 'rows' => 4, 'help' => 'Uno por línea: sector | descripción corta.' ) ),
					) ) ),
				) ),
				array( 'key' => 'proyectos', 'title' => 'Portada: proyectos, novedades y clientes', 'fields' => array(
					sayme_f( 'proyectos', 'group', 'Proyectos', array( 'fields' => array(
						sayme_f( 'kicker', 'text', 'Rótulo pequeño' ), sayme_f( 'title', 'text', 'Título' ), sayme_f( 'sub', 'textarea', 'Bajada', array( 'rows' => 2 ) ),
						sayme_f( 'ids', 'checklist', 'Proyectos que se muestran', array( 'source' => 'proyecto' ) ),
					) ) ),
					sayme_f( 'novedades', 'group', 'Novedades', array( 'fields' => array(
						sayme_f( 'hide', 'checkbox', 'Ocultar la sección de novedades' ),
						sayme_f( 'kicker', 'text', 'Rótulo pequeño' ), sayme_f( 'title', 'text', 'Título', array( 'help' => 'Rodea con *asteriscos* las palabras en color.' ) ), sayme_f( 'sub', 'textarea', 'Bajada', array( 'rows' => 2 ) ),
						sayme_f( 'max', 'text', 'Cuántas mostrar', array( 'help' => 'Número entre 1 y 12. Por defecto 6.' ) ),
					) ) ),
					sayme_f( 'clientes', 'group', 'Clientes', array( 'fields' => array(
						sayme_f( 'kicker', 'text', 'Rótulo pequeño' ), sayme_f( 'title', 'text', 'Título' ), sayme_f( 'sub', 'textarea', 'Bajada', array( 'rows' => 2 ) ),
					) ) ),
					sayme_f( 'contacto', 'group', 'Contacto (pie de la portada)', array( 'fields' => array(
						sayme_f( 'kicker', 'text', 'Rótulo pequeño' ), sayme_f( 'title', 'text', 'Título' ),
					) ) ),
				) ),
				array( 'key' => 'seo', 'title' => 'Google (SEO)', 'fields' => sayme_seo_fields() ),
			);

		case 'proyectos':
			return array(
				array( 'key' => 'hero', 'title' => 'Cabecera', 'fields' => array( sayme_f( 'hero', 'group', 'Cabecera', array( 'fields' => sayme_hero_simple_fields() ) ) ) ),
				array( 'key' => 'band', 'title' => 'Banda final («Hablemos»)', 'fields' => array(
					sayme_f( 'band', 'group', 'Banda final', array( 'fields' => array(
						sayme_f( 'kicker', 'text', 'Rótulo pequeño' ), sayme_f( 'title', 'text', 'Título' ), sayme_f( 'text', 'textarea', 'Texto', array( 'rows' => 2 ) ),
						sayme_f( 'btn1', 'text', 'Texto del botón 1' ), sayme_f( 'btn2', 'text', 'Texto del botón de WhatsApp' ), sayme_f( 'wa', 'text', 'Mensaje de WhatsApp' ),
					) ) ),
				) ),
				array( 'key' => 'seo', 'title' => 'Google (SEO)', 'fields' => sayme_seo_fields() ),
			);

		case 'contacto':
			return array(
				array( 'key' => 'hero', 'title' => 'Cabecera', 'fields' => array( sayme_f( 'hero', 'group', 'Cabecera', array( 'fields' => sayme_hero_simple_fields() ) ) ) ),
				array( 'key' => 'extra', 'title' => 'Formulario y pasos', 'fields' => array(
					sayme_f( 'placeholder', 'text', 'Texto de ayuda del mensaje' ),
					sayme_f( 'steps_label', 'text', 'Título de «Próximos pasos»' ),
					sayme_f( 'steps', 'rich', 'Próximos pasos', array( 'rows' => 5, 'help' => 'Uno por línea. Puedes usar negrita.' ) ),
				) ),
				array( 'key' => 'seo', 'title' => 'Google (SEO)', 'fields' => sayme_seo_fields() ),
			);

		case 'general':
			return array(
				array( 'key' => 'hero', 'title' => 'Cabecera', 'fields' => array( sayme_f( 'hero', 'group', 'Cabecera', array( 'fields' => sayme_hero_simple_fields() ) ) ) ),
				array( 'key' => 'strip', 'title' => 'Cifras destacadas (opcional)', 'fields' => array(
					sayme_f( 'strip', 'textarea', 'Cifras', array( 'rows' => 4, 'help' => 'Una por línea: cifra | descripción. Ejemplo: 25+ | años desde 2001' ) ),
				) ),
				array( 'key' => 'sections', 'title' => 'Secciones de la página', 'fields' => array(
					sayme_f( 'sections', 'repeater', 'Secciones', array( 'item_label' => 'title', 'fields' => sayme_section_fields() ) ),
				) ),
				array( 'key' => 'band', 'title' => 'Banda final («Hablemos»)', 'fields' => array(
					sayme_f( 'band', 'group', 'Banda final', array( 'fields' => array(
						sayme_f( 'kicker', 'text', 'Rótulo pequeño' ), sayme_f( 'title', 'text', 'Título' ), sayme_f( 'text', 'textarea', 'Texto', array( 'rows' => 2 ) ),
						sayme_f( 'btn1', 'text', 'Texto del botón 1' ), sayme_f( 'btn2', 'text', 'Texto del botón de WhatsApp' ), sayme_f( 'wa', 'text', 'Mensaje de WhatsApp' ),
					) ) ),
				) ),
				array( 'key' => 'seo', 'title' => 'Google (SEO)', 'fields' => sayme_seo_fields() ),
			);

		case 'options':
			return array(
				array( 'key' => 'contacto', 'title' => 'Datos de contacto', 'fields' => array(
					sayme_f( 'phone_label', 'text', 'Teléfono (como se muestra)', array( 'help' => 'Ejemplo: +56 9 9895 1625' ) ),
					sayme_f( 'phone_tel', 'text', 'Teléfono (para marcar, sin espacios)', array( 'help' => 'Ejemplo: +56998951625' ) ),
					sayme_f( 'email', 'text', 'Correo de contacto' ),
					sayme_f( 'address', 'text', 'Dirección' ),
					sayme_f( 'maps', 'text', 'Enlace de «Ver en el mapa»' ),
				) ),
				array( 'key' => 'whatsapp', 'title' => 'WhatsApp y formulario', 'fields' => array(
					sayme_f( 'whatsapp', 'text', 'Número de WhatsApp', array( 'help' => 'Con código de país y sin «+». Ejemplo: 56998951625' ) ),
					sayme_f( 'wa_message', 'text', 'Mensaje inicial de WhatsApp' ),
					sayme_f( 'form_to', 'text', 'Correo que recibe el formulario de contacto', array( 'help' => 'Si lo dejas vacío, llega al correo de contacto.' ) ),
				) ),
				array( 'key' => 'redes', 'title' => 'Redes sociales', 'fields' => array(
					sayme_f( 'linkedin', 'text', 'Página de LinkedIn' ),
					sayme_f( 'linkedin_cover', 'image', 'Portada de LinkedIn (vista previa)' ),
				) ),
				array( 'key' => 'pie', 'title' => 'Pie de página y logo', 'fields' => array(
					sayme_f( 'footer_text', 'textarea', 'Texto del pie de página', array( 'rows' => 3 ) ),
					sayme_f( 'footer_tagline', 'text', 'Frase final del pie' ),
					sayme_f( 'copyright', 'text', 'Línea de derechos reservados' ),
					sayme_f( 'logo', 'image', 'Logo (páginas interiores)' ),
					sayme_f( 'home_logo', 'image', 'Logo (portada)' ),
				) ),
			);
	}
	return array();
}

/** Servicios de interés para el formulario de contacto (nombres de los servicios activos). */
function sayme_service_labels() {
	$l = array();
	foreach ( sayme_services() as $s ) { $l[] = $s['label']; }
	return $l;
}
