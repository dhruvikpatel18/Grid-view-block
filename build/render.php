<?php
/**
 * Render the project grid block on the front end.
 *
 * This function is responsible for generating the HTML output for the custom block.
 * It uses block attributes to filter the displayed content and creates a custom query to fetch the required data.
 *
 * @param array $attributes Block attributes used to determine what content to display.
 * @return string The block's rendered HTML.
 */
function render_project_grid_block($attributes) {
    // Extract selected terms from the block attributes, if set.
    $selected_terms = isset($attributes['selectedTerms']) ? $attributes['selectedTerms'] : [];

    // Default query arguments for fetching portfolio posts
    $args = [
        'post_type' => 'portfolio', // Define post type to query
        'posts_per_page' => -1, // Fetch all available posts
    ];

    // If there are selected terms, add a tax query for filtering
    if (!empty($selected_terms)) {
        $tax_query = []; // Array to hold taxonomy query conditions
        foreach ($selected_terms as $taxonomy => $term) {
            if ($term) {
                // Add a condition to the tax query for each selected term
                $tax_query[] = [
                    'taxonomy' => $taxonomy, // Taxonomy name
                    'field' => 'slug', // Field used for comparison
                    'terms' => $term, // Selected term slug
                ];
            }
        }

        // If the tax query is not empty, add it to the query arguments
        if (!empty($tax_query)) {
            $args['tax_query'] = $tax_query; // Include tax query in query arguments
        }
    }

    // Create a new WP_Query with the defined arguments
    $query = new WP_Query($args);

    // Check if there are any posts to display
    if ($query->have_posts()) {
        ob_start(); // Start output buffering

        echo '<div class="portfolio-grid">'; // Start of the portfolio grid
        while ($query->have_posts()) {
            $query->the_post(); // Move to the next post

            echo '<div class="portfolio-item">'; // Start of a portfolio item
            
            // Display the post title with a hyperlink to the post
            echo '<a href="' . get_permalink() . '">'; 
            echo '<h2>' . get_the_title() . '</h2>'; 
            echo '</a>'; // End of hyperlink

            // Display the post thumbnail if it exists
            if (has_post_thumbnail()) {
                the_post_thumbnail(); // Display post thumbnail
            }
            
            // Display truncated content with a "Read more" link
            $content = wp_trim_words(get_the_content(), 20, '...'); // Truncate content to 20 words
            echo '<div>' . $content . ' <a href="' . get_permalink() . '">Read more</a></div>'; 
            
            echo '</div>'; // End of portfolio item
        }
        echo '</div>'; // End of the portfolio grid

        wp_reset_postdata(); // Reset post data to prevent interference with other queries
        return ob_get_clean(); // Return the buffered output
    } else {
        // If no posts are found, return a message indicating no projects were found
        return 'No projects found.';
    }
}
