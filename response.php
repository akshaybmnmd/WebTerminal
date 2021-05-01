<?php

if (!$_POST) {
    die(json_encode([
        'status' => 'error',
        'error' => ['m' => "Server Refused connection.", 'code' => 405, 'details' => ['server only handles POST request.']]
    ]));
}

if ($_REQUEST['action'] == 'run') {
    execute($_REQUEST['cmd']);
} else {
    die(json_encode([
        'status' => 'error',
        'error' => ['m' => "Miss configured request.", 'code' => 400, 'details' => ['unknown action parameter.']],
        'cmd' => $_REQUEST['cmd']
    ]));
}

function execute($cmd)
{
    $cmdarr = array_filter(explode(" ", $cmd));
    $req = "./functions/" . $cmdarr[0] . ".php";
    if (file_exists($req)) {
        require_once($req);
        die(json_encode($response));
    } else {
        $response = "unknown command " . $cmdarr[0];
        $error = ['m' => $response, 'code' => 100, 'details' => ['the requsted command is not found in the system!', "filenotfound" => $req]];
        die(json_encode([
            'status' => 'success',
            'response' => $response,
            'cmd' => $_REQUEST['cmd'],
            'error' => $error
        ]));
    }
}
