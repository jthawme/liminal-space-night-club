<?php

get_header();

if ( have_posts() ) {

    while ( have_posts() ) {

        the_post();

    }

} else {

    //No results found

}

get_footer();
