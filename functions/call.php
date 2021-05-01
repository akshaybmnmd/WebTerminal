<?php

if (isset($cmdarr[1]) && isset($cmdarr[2])) {
    if ($cmdarr[1] == 'me') {
        $response = [
            'status' => 'success',
            'response' => "Name changed",
            'cmd' => $_REQUEST['cmd'],
            'action' => 1001,
            'on' => 'user',
            'name' => $cmdarr[2],
            'error' => null
        ];
    } elseif ($cmdarr[1] == 'you') {
        $response = [
            'status' => 'success',
            'response' => "Name changed",
            'cmd' => $_REQUEST['cmd'],
            'action' => 1001,
            'on' => 'root',
            'name' => $cmdarr[2],
            'error' => null
        ];
    } else {
        $response = [
            'status' => 'success',
            'response' => "the second parameter needs to be me or you.",
            'cmd' => $_REQUEST['cmd'],
            'error' => ['m' => "missing parameters in command", 'code' => 209, 'details' => ['the command should be like call me name or call you root']]
        ];
    }
} else {
    $response = [
        'status' => 'success',
        'response' => "missing operations",
        'cmd' => $_REQUEST['cmd'],
        'error' => ['m' => "miss configured command", 'code' => 208, 'details' => ['the command should be like call me name or call you root']]
    ];
}
