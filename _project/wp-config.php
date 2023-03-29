<?php

require_once(__DIR__ . '/vendor/autoload.php');
$dotenv = Dotenv\Dotenv::create(__DIR__);
$dotenv->load();

/** Enable W3 Total Cache */
define('WP_CACHE',          filter_var(getenv('WP_CACHE'), FILTER_VALIDATE_BOOLEAN)); // Added by W3 Total Cache

define('DB_NAME',           getenv('DB_NAME'));
define('DB_USER',           getenv('DB_USER'));
define('DB_PASSWORD',       getenv('DB_PASSWORD'));
define('DB_HOST',           getenv('DB_HOST'));
define('DB_CHARSET',        'utf8');
define('DB_COLLATE',        '');

define('AUTH_KEY',         'SE/LS#7ecJJ,h2)C6saX4`b1,=/otr];.`Q<6DcUB]I@[832e9?%}0*%efTxY#V;');
define('SECURE_AUTH_KEY',  ')7,l-FTp2LkhhzIcE3!zt~%Ol{.l5W*iaVw{7d@TJN{6c<$<YH@1or[uaXIH/A|Q');
define('LOGGED_IN_KEY',    '^gsm{>%V@ZB8p-Tdl-a@_D-Ag/|Mjg$qT$*f Z6>i+Q[Ba;#~QE}J Gb1Z;593J$');
define('NONCE_KEY',        '6lGj&~Da})rHDSYBqg#L/-?-fp:6GjN(59B]z2q11p7$*r:WfwG]jE>@Y5/u/ti8');
define('AUTH_SALT',        '}Lxnq?<XJ 2ka$+?Iwnd#DCLQt-rSpE}C-JpfAn~Dm_Y:2W>/UY=q/[J`|ZEP.yc');
define('SECURE_AUTH_SALT', '5L{wxS8#a~u3;6L,W}azx0;nqfx=8*A-lHfv|I~ny]8r$EnqKts_yBN})u$+|$6B');
define('LOGGED_IN_SALT',   'Ac8EpnL1*% 2.0s4*cx=9uI2iwV0y5`kh:X|Dhpm.Z>$*G*s|qugAh}6aD&>]$PM');
define('NONCE_SALT',       't%H=DpmPU-;wY!RL&-X&;gcDm|s?c<i8ZJB|A-]*:,.OSIEc/2x;[8`#sN_,Cey|');

$table_prefix               = getenv('DB_PREFIX');
define('WPLANG',            '');

define('WP_SITEURL',        getenv('SITE_URL'));
define('WP_HOME',           getenv('SITE_URL'));

define( 'WP_DEBUG',         filter_var(getenv('WP_DEBUG'), FILTER_VALIDATE_BOOLEAN));
define( 'SAVEQUERIES',      filter_var(getenv('WP_SAVE_QUERIES'), FILTER_VALIDATE_BOOLEAN));

define( 'DISALLOW_FILE_EDIT', filter_var(getenv('DISALLOW_FILE_EDIT'), FILTER_VALIDATE_BOOLEAN));

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
    define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
