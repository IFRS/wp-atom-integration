<?php

function atom_settings_admin_menu() { 

	$page_title = 'Configuração do Atom';
	$menu_title = 'Configuração do Atom';
	$capability = 'manage_options';
	$menu_slug  = 'atom-settings';
	$function   = 'atom_settings_page';

	add_plugins_page( $page_title,
		$menu_title, 
		$capability, 
		$menu_slug, 
		$function );

	add_action( 'admin_init', 'update_atom_settings' );
}

function atom_settings_page(){
	?>
		<div class="wrap">
			<h1 class='wp-heading-inline'>Configuração do Atom</h1>
		</div>
		<form method='post' action="options.php">
			<?php
				settings_fields( 'atom-settings' );
				do_settings_sections( 'atom-settings' );
			?>
			<table class="form-table">
				<tr valign="top">
					<th scope="row">Url do index.php</th>
					<td><input type="text" name="atom_url_index" value="<?php echo get_option('atom_url_index'); ?>"/></td>
				</tr>
				<tr valign="top">
					<th scope="row">Url base da API</th>
					<td><input type="text" name="atom_url_api" value="<?php echo get_option('atom_url_api'); ?>"/></td>
				</tr>
				<tr valign="top">
					<th scope="row">Chave de acesso da API</th>
					<td><input type="text" name="atom_api_key" value="<?php echo get_option('atom_api_key'); ?>"/></td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>
	<?php
}

function update_atom_settings() { 
	register_setting( 'atom-settings', 'atom_url_index' );
	register_setting( 'atom-settings', 'atom_url_api' );
	register_setting( 'atom-settings', 'atom_api_key' );
}

function atom_link_shortcode( $atts, $content = '' ) {
    $arr = shortcode_atts(
        array(
            'sf_culture' => 'pt',
			'slug' => '',
			'atom_url_index' => get_option('atom_url_index'),
			'atom_url_api' => get_option('atom_url_api'),
			'atom_api_key' => get_option('atom_api_key')
        ),
        $atts
    );

    wp_enqueue_script('atom-link-js');
    wp_localize_script('atom-link-js','shortcode_options', $arr);

    return '
        <div id="atom-link-root">
            <atom-link></atom-link>
        </div>
    ';

    /*
    return '
        <div id="atom-link-root">
            <a v-if="!error" :href="result.digital_object.url">{{ result.title }}</a>
            <div v-else><p>Ocorreu um erro!</p></div>
        </div>
    ';
    */
}

function atom_link_recents_shortcode( $atts, $content = '' ) {
    $arr = shortcode_atts(
        array(
            'sf_culture' => 'pt',
			'number' => 5,
			'atom_url_index' => get_option('atom_url_index'),
			'atom_url_api' => get_option('atom_url_api'),
			'atom_api_key' => get_option('atom_api_key')
        ),
        $atts
    );

    wp_enqueue_script('atom-link-js');
    wp_localize_script('atom-link-js','shortcode_options', $arr);

    return '
        <div id="atom-link-root">
            <atom-recents-link></atom-recents-link>
        </div>
    ';
}

add_action( 'admin_menu', 'atom_settings_admin_menu' );
add_shortcode('atom-link', 'atom_link_shortcode' );
add_shortcode('atom-recents-link', 'atom_link_recents_shortcode' );