<?php

//error_reporting(E_ALL);
//ini_set('display_errors', 1);
require("lib/v1.php");

 
$hapi = new HolidayAPI\v1('241d9571-3502-47d2-9259-4728e754a7e6');//_YOUR_API_KEY_

$parameters = array(
  // Required
  'country' => 'US',
  'year'    => '2017',
  'public'   => true,
  // Optional
  // 'month'    => 7,
  // 'day'      => 4,
  // 'previous' => true,
  // 'upcoming' => true,
  // 'public'   => true,
  // 'pretty'   => true,
);
 
$response = $hapi->holidays($parameters);
print_r($response);