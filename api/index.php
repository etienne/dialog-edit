<?php

header('Access-Control-Allow-Origin: *');

$data_dir = '../data/';
$store = "{$data_dir}store.json";
$current_minutes = date('i');
$round_down_to = 5;
$rounded_minutes = floor($current_minutes / $round_down_to) * $round_down_to;
$padded_minutes = str_pad($rounded_minutes, 2, '0', STR_PAD_LEFT);
$backup_date = date('Y_m_d_H') . $padded_minutes;
$backup_store = "{$data_dir}store-{$backup_date}.json";

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
