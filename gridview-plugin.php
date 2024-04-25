<?php
/**
 * Plugin Name:       Grid View
 * Description:       A custom Gutenberg dynamic block for listing all projects in a grid view.
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
 * Registers the block using the metadata loaded from `block.json`.
 * Sets the `render_callback` to handle dynamic rendering.
 * Includes the necessary script for the block editor.
 */
function grid_view_plugin_block_init() {
    // Register the editor script for the block
    wp_register_script(
        'your-block-editor-script',  // Unique handle for your script
        plugins_url('build/index.js', __FILE__),  // Path to your block script
        [ 'wp-blocks', 'wp-element', 'wp-editor' ],  // WordPress dependencies
        filemtime(plugin_dir_path(__FILE__) . 'build/index.js'),  // Cache-busting for updates
        true  // Load in the footer
    );

    // Define the block registration arguments
    $block_args = [
        'render_callback' => 'render_project_grid_block',  // Dynamic rendering function
    ];

    // Register the block with the dynamic callback
    register_block_type_from_metadata(__DIR__ . '/build', $block_args);
}

// Hook the block registration to WordPress init
add_action( 'init', 'grid_view_plugin_block_init' );

// Include the render function file
require_once __DIR__ . '/build/render.php';  // Ensure render function is included
