

<?php
    require_once(dirname(__FILE__) . '/wp-config.php');
    $wp->init();
    $wp->parse_request();
    $wp->query_posts();
    $wp->register_globals();
    $wp->send_headers();


    <p> Su DNI es</p>
    echo ($_POST);
    
    echo site_url();
?>
