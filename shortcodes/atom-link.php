<?php

function atom_link_shortcode( $atts, $content = '' ) {
    $arr = shortcode_atts(
        array(
            'sf_culture' => 'pt'
        ),
        $atts
    );

    wp_enqueue_script('atom-link-js');
    wp_localize_script('atom-link-js','shortcode_options', $arr);
    wp_localize_script('atom-link-js','shortcode_slug', array('slug' => $content));

    return '
        <div id="atom-link-root">
            <a v-if="!error" :href="result.digital_object.url">{{ result.title }}</a>
            <div v-else><p>Ocorreu um erro!</p></div>
        </div>
    ';
}

add_shortcode( 'atom-link', 'atom_link_shortcode' );
