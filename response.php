<?php

if (!$_POST) {
    die("only accept post request");
}

if ($_REQUEST['action'] == 'run') {
    echo $_REQUEST['cmd'];
} else {
    echo "unknown action";
}
