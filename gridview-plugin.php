<?php
/**
 * Plugin Name:       Grid view
 * Description:       A custom Gutenberg dynamic block for listing all projects in grid view.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Dhruvik Malaviya
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gridview-plugin
 *
 * @package GridView
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Additionally, it sets the render callback to handle dynamic rendering of the block.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function grid_view_plugin_block_init() {
    $block_args = [
        'editor_script' => 'your-block-editor-script',  // The script for your block editor
        'render_callback' => 'render_project_grid_block',  // Name of your render function
    ];

    register_block_type( __DIR__ . '/build', $block_args );
}
add_action( 'init', 'grid_view_plugin_block_init' );

// Include the render function file
require_once __DIR__ . '/build/render.php';
