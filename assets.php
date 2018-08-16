<?php

function atom_scripts() {
    wp_register_script('atom-link-js', plugin_dir_url(__FILE__) . 'js/atom_link.js', array(), null, true);
}

add_action('wp_enqueue_scripts','atom_scripts');
