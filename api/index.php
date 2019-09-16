<?php

header('Access-Control-Allow-Origin: *');

$store = 'store.json';
$rounded_minutes = floor(date('i') / 5) * 5;
$backup_date = date('YmdH') . $rounded_minutes;
$backup_store = "store-{$backup_date}.json";

function error($message) {
  echo json_encode(['status' => 'error', 'message' => $message]);
}

switch ($_SERVER['REQUEST_METHOD']) {
  case 'GET':
    readfile($store);
    break;
  case 'POST':
    if (!$handle = fopen($store, 'w')) {
      error('Data store is not accessible');
      break;
    }

    if (!$backup_handle = fopen($backup_store, 'w')) {
      error('Backup store is not accessible');
      break;
    }
    
    if (!$data = file_get_contents('php://input')) {
      error('Submitted input is invalid');
      break;
    }

    if (!fwrite($handle, $data)) {
      error('Data could not be saved');
      break;
    };

    if (!fwrite($backup_handle, $data)) {
      error('Backup could not be saved');
      break;
    };

    if (!fclose($handle)) {
      error('Could not clean up after data write');
      break;
    }

    if (!fclose($backup_handle)) {
      error('Could not clean up after backup write');
      break;
    }

    echo json_encode(['status' => 'success']);
    break;
  case 'OPTIONS':
    header('Access-Control-Allow-Headers: Content-Type');
    break;
}
