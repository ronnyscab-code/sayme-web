<?php
/* Portada. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
the_post();
$d    = sayme_data( get_the_ID() );
$hero = sayme_get( $d, 'hero', array() );
$home = home_url( '/' );
$contacto = sayme_page_url( 'contacto' );
?>
<nav>
  <div class="wrap">
    <a class="logo" href="#top" aria-label="SAYME, inicio"><img alt="SAYME" src="<?php echo esc_url( sayme_img( sayme_opt( 'home_logo' ) ) ); ?>"></a>
    <ul>
      <li><a class="l" href="#servicios">Servicios</a></li>
      <li><a class="l" href="#soluciones">Soluciones</a></li>
      <li><a class="l" href="<?php echo esc_url( sayme_page_url( 'nosotros' ) ); ?>">Nosotros</a></li>
      <li><a class="l" href="<?php echo esc_url( sayme_page_url( 'proyectos' ) ); ?>">Proyectos</a></li>
      <li><a class="l" href="#clientes">Clientes</a></li>
      <li><a class="l" href="<?php echo esc_url( $contacto ); ?>">Contacto</a></li>
      <li><a class="btn main" style="padding:9px 16px" href="<?php echo esc_url( $contacto ); ?>">Cotizar</a></li>
    </ul>
  </div>
</nav>

<header class="hero" id="top">
  <canvas id="scene" aria-label="Haz 3D de cables de cobre y fibra óptica con pulsos de luz viajando por cada hebra"></canvas>
  <div class="wrap">
    <span class="mono"><?php echo sayme_e( sayme_get( $hero, 'kicker' ) ); ?></span>
    <h1 style="margin-top:14px"><?php echo sayme_accent( sayme_get( $hero, 'title' ) ); ?></h1>
    <p class="lead"><?php echo sayme_e( sayme_get( $hero, 'lead' ) ); ?></p>
    <div class="cta">
      <a class="btn main" href="<?php echo esc_url( $contacto ); ?>"><?php echo sayme_e( sayme_get( $hero, 'btn1' ) ); ?></a>
      <a class="btn" href="#servicios"><?php echo sayme_e( sayme_get( $hero, 'btn2' ) ); ?></a>
    </div>
    <div class="sel" role="group" aria-label="Resaltar tipo de cableado">
      <span class="mono">Resaltar</span>
      <button class="chip" data-g="-1" aria-pressed="true" style="--c:#1f3a5f">Todo</button>
      <button class="chip" data-g="0" aria-pressed="false" style="--c:var(--slate)"><i></i>Cobre</button>
      <button class="chip" data-g="1" aria-pressed="false" style="--c:var(--navy)"><i></i>Fibra OS2</button>
      <button class="chip" data-g="2" aria-pressed="false" style="--c:var(--teal)"><i></i>Fibra OM3/OM4</button>
    </div>
  </div>
</header>

<?php sayme_banner( $d ); ?>

<?php $sv = sayme_get( $d, 'servicios', array() ); ?>
<section class="blk" id="servicios">
  <div class="wrap">
    <span class="mono"><?php echo sayme_e( sayme_get( $sv, 'kicker' ) ); ?></span>
    <h2><?php echo sayme_e( sayme_get( $sv, 'title' ) ); ?></h2>
    <p class="sub"><?php echo sayme_e( sayme_get( $sv, 'sub' ) ); ?></p>
    <div class="cards">
<?php foreach ( sayme_services() as $s ) :
	$sd    = $s['data'];
	$color = sayme_get( $sd, 'card.home_color', 'navy' );
	$ttl   = sayme_get( $sd, 'card.home_title' ) ?: $s['label'];
	?>
      <a class="card" href="<?php echo esc_url( $s['url'] ); ?>" style="--c:var(--<?php echo esc_attr( $color ); ?>);text-decoration:none;color:inherit;display:block"><h3><?php echo sayme_e( $ttl ); ?></h3><p><?php echo sayme_e( sayme_get( $sd, 'card.home_text' ) ); ?></p><span class="mono"><?php echo sayme_e( sayme_get( $sd, 'card.home_tag' ) ); ?> &rarr;</span></a>
<?php endforeach; ?>
    </div>
    <p style="margin-top:28px;color:var(--body);max-width:70ch"><?php echo sayme_e( sayme_get( $sv, 'foot' ) ); ?></p>
  </div>
</section>

<?php $so = sayme_get( $d, 'soluciones', array() ); ?>
<section class="blk" id="soluciones">
  <div class="wrap">
    <span class="mono"><?php echo sayme_e( sayme_get( $so, 'kicker' ) ); ?></span>
    <h2><?php echo sayme_e( sayme_get( $so, 'title' ) ); ?></h2>
    <p class="sub"><?php echo sayme_e( sayme_get( $so, 'sub' ) ); ?></p>
    <div class="steps">
<?php $i = 0; foreach ( (array) sayme_get( $so, 'items', array() ) as $it ) : $i++; ?>
      <div class="step"><div class="n"><?php echo sprintf( '%02d', $i ); ?></div><h3><?php echo sayme_e( sayme_get( $it, 'title' ) ); ?></h3><p><?php echo sayme_e( sayme_get( $it, 'text' ) ); ?></p></div>
<?php endforeach; ?>
    </div>
  </div>
</section>

<?php $no = sayme_get( $d, 'nosotros', array() ); ?>
<section class="blk" id="nosotros">
  <div class="wrap two">
    <div>
      <span class="mono"><?php echo sayme_e( sayme_get( $no, 'kicker' ) ); ?></span>
      <h2><?php echo sayme_e( sayme_get( $no, 'title' ) ); ?></h2>
      <?php echo sayme_render_list( sayme_get( $no, 'list' ) ); ?>
    </div>
    <div>
      <span class="mono"><?php echo sayme_e( sayme_get( $no, 'kicker2' ) ); ?></span>
      <h2><?php echo sayme_e( sayme_get( $no, 'title2' ) ); ?></h2>
      <div class="sectors">
<?php foreach ( sayme_lines( sayme_get( $no, 'sectors' ) ) as $r ) : $p = array_map( 'trim', explode( '|', $r, 2 ) ); ?>
        <div class="sector"><b><?php echo sayme_e( $p[0] ); ?></b><span><?php echo sayme_e( isset( $p[1] ) ? $p[1] : '' ); ?></span></div>
<?php endforeach; ?>
      </div>
    </div>
  </div>
</section>

<?php $pj = sayme_get( $d, 'proyectos', array() ); $all = sayme_projects(); ?>
<section class="blk" id="proyectos">
  <div class="wrap">
    <span class="mono"><?php echo sayme_e( sayme_get( $pj, 'kicker' ) ); ?></span>
    <h2><?php echo sayme_e( sayme_get( $pj, 'title' ) ); ?></h2>
    <p class="sub"><?php echo sayme_e( sayme_get( $pj, 'sub' ) ); ?></p>
    <div class="pgrid" id="pgrid">
<?php foreach ( (array) sayme_get( $pj, 'ids', array() ) as $key ) { if ( isset( $all[ $key ] ) ) { sayme_project_card( $all[ $key ], 'home' ); } } ?>
    </div>
  </div>
</section>

<?php sayme_novedades_section( $d ); ?>

<?php $cl = sayme_get( $d, 'clientes', array() ); ?>
<section class="blk ring-sec" id="clientes">
  <div class="wrap">
    <span class="mono"><?php echo sayme_e( sayme_get( $cl, 'kicker' ) ); ?></span>
    <h2><?php echo sayme_e( sayme_get( $cl, 'title' ) ); ?></h2>
    <p class="sub"><?php echo sayme_e( sayme_get( $cl, 'sub' ) ); ?></p>
  </div>
  <div class="stage" id="stage" tabindex="0" aria-roledescription="carrusel" aria-label="Carrusel 3D de clientes">
    <div class="ring" id="ring"></div>
    <div class="floor"></div>
  </div>
  <div class="rc">
    <button id="prev" aria-label="Cliente anterior">&#8592;</button>
    <div class="cap" aria-live="polite"><b id="capName"><?php $cc = sayme_get_clients(); echo $cc ? sayme_e( $cc[0]['name'] ) : ''; ?></b><span class="mono" id="capSub">Cliente</span></div>
    <button id="next" aria-label="Cliente siguiente">&#8594;</button>
  </div>
</section>

<?php $ct = sayme_get( $d, 'contacto', array() ); ?>
<footer id="contacto">
  <div class="wrap">
    <div class="contact">
      <div>
        <span class="mono"><?php echo sayme_e( sayme_get( $ct, 'kicker' ) ); ?></span>
        <h2><?php echo sayme_e( sayme_get( $ct, 'title' ) ); ?></h2>
      </div>
      <div class="dl">
        <div><span class="mono">Correo</span><br><a href="mailto:<?php echo esc_attr( sayme_opt( 'email' ) ); ?>"><?php echo sayme_e( sayme_opt( 'email' ) ); ?></a></div>
        <div><span class="mono">Teléfono</span><br><a href="tel:<?php echo esc_attr( sayme_opt( 'phone_tel' ) ); ?>"><?php echo sayme_e( sayme_opt( 'phone_label' ) ); ?></a></div>
        <div><span class="mono">Dirección</span><br><?php echo sayme_e( sayme_opt( 'address' ) ); ?></div>
        <div><span class="mono">LinkedIn</span><br><a data-linkedin href="<?php echo esc_url( sayme_opt( 'linkedin' ) ); ?>">Sayme Ltda</a></div>
      </div>
    </div>
    <p class="fine"><?php echo sayme_e( sayme_opt( 'copyright' ) ); ?> · <?php
	$links = array();
	foreach ( sayme_services() as $s ) {
		$short = sayme_get( $s['data'], 'card.footer_label' );
		if ( $short ) { $links[] = '<a href="' . esc_url( $s['url'] ) . '">' . sayme_e( $short ) . '</a>'; }
	}
	$links[] = '<a href="' . esc_url( sayme_page_url( 'proyectos' ) ) . '">Proyectos</a>';
	echo implode( ' · ', $links );
	?></p>
  </div>
</footer>
<?php
sayme_render_whatsapp_fab();
get_footer();
