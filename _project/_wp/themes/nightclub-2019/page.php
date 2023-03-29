<?php

get_header();

while ( have_posts() ) {

    the_post();

}

get_footer();
