<?php

function getFeaturedImageAlt($post_id) {

    $thumbnail_id          = get_post_thumbnail_id( $post_id );
    return get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);

}

function getUIChunk($chunk_name, $parameters = []) {

    foreach($parameters as $key => $parameter) {

        $$key = $parameter;

    }

    require(locate_template('_template-parts/' . $chunk_name . '.ui.php'));

}

function isAttachmentPortraitOrLandscape($id): string {

    $data = wp_get_attachment_metadata($id);

    if(!isset($data['width']) || !isset($data['height'])) {

        return '';

    }

    return ($data['width'] > $data['height']) ? 'landscape' : 'portrait';

}

function stripDomainFromLink($url) {

    //AW: This is a bit kludgey. We are stripping the domain name to allow for the persistant loading on internal pages
    if(parse_url($url, PHP_URL_HOST) == $_SERVER['HTTP_HOST']) {

        $url = parse_url($url, PHP_URL_PATH) . (!empty(parse_url($url, PHP_URL_QUERY)) ? '?' . parse_url($url, PHP_URL_QUERY) : '');

    }
    return $url;

}

function calculateDisplayDates($start, $end = null) {

    $date_string = '';

    if(empty($start)) {

        $date_string = '';

    } else if(empty($end)) {

        //We only have a start date
        $date_string = date('jS M Y', strtotime($start));

    } else {

        if(date('j', strtotime($start)) == date('j', strtotime($end)) && date('F', strtotime($start)) == date('F', strtotime($end)) && date('Y', strtotime($start)) == date('Y', strtotime($end))) {

            $date_string = date('jS M Y', strtotime($start));

        } else if(date('F', strtotime($start)) == date('F', strtotime($end)) && date('Y', strtotime($start)) == date('Y', strtotime($end))) {

            $date_string = date('jS', strtotime($start)) . '-' . date('jS', strtotime($end)) . ' ' . date('M Y', strtotime($start));

        } else if(date('Y', strtotime($start)) == date('Y', strtotime($end))) {

            $date_string = date('jS M', strtotime($start)) . ' - ' . date('jS M', strtotime($end)) . ' ' . date('Y', strtotime($start));

        } else {

            $date_string = date('j M y', strtotime($start)) . ' - ' . date('j M y', strtotime($end));

        }

    }

    return $date_string;

}
