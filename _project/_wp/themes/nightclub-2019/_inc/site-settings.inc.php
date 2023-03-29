<?php
// https://www.sitepoint.com/create-a-wordpress-theme-settings-page-with-the-settings-api/
function theme_settings_page(){

    ?>
            <div class="wrap">
            <h1>Site settings</h1>
            <form method="post" action="options.php">
                <?php
                    settings_fields("section");
                    do_settings_sections("theme-options");
                    submit_button();
                ?>
            </form>
            </div>
        <?php


}

function display_twitter_element() {

    ?>
        <input type="text" name="twitter_url" id="twitter_url" value="<?php echo get_option('twitter_url'); ?>" />
    <?php

}

function display_facebook_element() {

    ?>
        <input type="text" name="facebook_url" id="facebook_url" value="<?php echo get_option('facebook_url'); ?>" />
    <?php

}

function display_instagram_element() {

    ?>
        <input type="text" name="instagram_url" id="instagram_url" value="<?php echo get_option('instagram_url'); ?>" />
    <?php

}

function display_youtube_element() {

    ?>
        <input type="text" name="youtube_url" id="youtube_url" value="<?php echo get_option('youtube_url'); ?>" />
    <?php

}

function display_theme_panel_fields() {

    add_settings_section("section", "All Settings", null, "theme-options");

    add_settings_field("twitter_url", "Twitter Url", "display_twitter_element", "theme-options", "section");
    add_settings_field("facebook_url", "Facebook Url", "display_facebook_element", "theme-options", "section");
    add_settings_field("instagram_url", "Instagram Url", "display_instagram_element", "theme-options", "section");
    add_settings_field("youtube_url", "Youtube Url", "display_youtube_element", "theme-options", "section");


    register_setting("section", "twitter_url");
    register_setting("section", "facebook_url");
    register_setting("section", "instagram_url");
    register_setting("section", "youtube_url");

}

add_action("admin_init", "display_theme_panel_fields");

function add_theme_menu_item() {

    add_menu_page("Site settings", "Site settings", "manage_options", "theme-panel", "theme_settings_page", null, 99);

}

add_action("admin_menu", "add_theme_menu_item");
