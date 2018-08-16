<?php
defined('ABSPATH') or die('No script kiddies please!');
/*
Plugin Name: Wordpress Access to Memory Integration
Plugin URI:  https://github.com/IFRS/wp-atom-integration
Description: Plugin para integração com o AtoM (Access to Memory).
Version:     1.0.0
Author:      Ricardo Moro
Author URI:  https://github.com/ricardomoro
License:     GPL3
License URI: https://www.gnu.org/licenses/gpl-3.0.txt
Text Domain: wp-atom-integration
Domain Path: /lang
*/

require_once('assets.php');

require_once('shortcodes/atom-link.php');

register_activation_hook(__FILE__, function () {

});

register_deactivation_hook(__FILE__, function () {

});
