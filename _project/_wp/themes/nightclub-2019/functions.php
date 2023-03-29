<?php

add_filter( 'use_block_editor_for_post', '__return_false' );

// Register WP support items
add_theme_support( 'menus' );
add_theme_support( 'post-thumbnails');


// Register CPTs
#include( '_custom-post-types/location.cpt.php' );
//include( '_cpt/event.php' );

// Register ACF fields
include( '_acf/questions.acf.php' );

// Register Site Settings
#include( '_inc/settings.inc.php' );

// Register Misc
include( '_inc/cleanup.inc.php' );


// Init BWU helpers
include( '_inc/bwu.inc.php' );


if( function_exists('acf_add_options_page') ) {

    acf_add_options_page(array(
            'page_title'    => 'Site Settings',
            'menu_title'    => 'Site Settings',
            'menu_slug'     => 'site-general-settings',
            'capability'    => 'edit_posts',
            'redirect'      => false
        ));

    acf_add_options_sub_page(array(
            'page_title'    => '404 Page',
            'menu_title'    => '404 Page',
            'parent_slug'   => 'site-general-settings',
        ));


}
