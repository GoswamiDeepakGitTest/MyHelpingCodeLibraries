<?php
/*$sql = "INSERT INTO table_name (field1,field2,fieldn) VALUES";
$qty = 1100;
for($i=0;$i< $qty;$i++){
  $sql .= "('val1','val2','valn')";
  if($i < ($qty -1 )){
     $sql .=",";
   }

 }
 echo $sql;
 exit;*/
/*$value='00504';
$formatted_value = str_pad($value, 5, '0', STR_PAD_LEFT);
echo '$formatted_value:'.$formatted_value;
exit;*/
ini_set('max_execution_time', 0);
//Code to connect with Live "trucking_mileage" database for dno contact application
$servername = "localhost";
$username = "root";
$password = "";
$db_name = "trucking_mileage";

// Create connection
$conn = new mysqli($servername, $username, $password, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

//$CSVFilePath= 'zipcode GMT.csv'
$CSVFilePath= 'D:\Server Login Credentials1\MantisSites\jandsdev.com(Trucking)\Trucking_New_Items\DST\missingZipcodeGMT.csv';
$CSVFilePath= 'E:\CustomDrive\htdocs\HelpingLibraries\webcrawl\country.csv';
$row = 1;
if (($handle = fopen($CSVFilePath, "r")) !== FALSE) {
	$missingZip = array();
	$duplicateZip = array();
	$insertQuery= "INSERT INTO `ci_dst_zipcode_gmt_timezone`(`intUniqueId`, `varZipCode`, `varCityName`, `varStateCode`, `varLatitude`, `varLongitude`, `intGmtTimeZone`, `intDstAdjustment`) VALUES";
	$insertQueryValues='';$i=0;
	$fp = file($CSVFilePath, FILE_SKIP_EMPTY_LINES);
	$totalRowCount=count($fp); 
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        $num = count($data);
        echo "<p> $num fields in line $row: <br /></p>\n"; 
        $row++;
        for ($c=0; $c < $num; $c++) {
            //echo $data[$c] . "<br />\n";
			//print_r($data[$c]);
        }
		
		$id = isset($data[0]) ? trim($data[0]) : '';
		$zip = isset($data[1]) ? ''.trim($data[1]) : '';
		$cityName = isset($data[2]) ? addslashes(trim($data[2])) : '';
		$stateCode = isset($data[3]) ? trim($data[3]) : '';
		$latitude = isset($data[4]) ? trim($data[4]) : '';
		$longitude = isset($data[5]) ? trim($data[5]) : '';
		$gmtTimeZone = isset($data[6]) ? trim($data[6]) : '';
		$dstAdjustment = isset($data[7]) ? trim($data[7]) : '';
		$formatted_zipvalue = str_pad($zip, 5, '0', STR_PAD_LEFT);
		
		// If you got valid zip code value (i.e. not blank and not 0)
		if (!empty($zip))
		{
			
			// Code to create insert query for adding multiple rows at one time.
			if($i == 0){
				$insertQueryValues .= "('{$id}','{$formatted_zipvalue}','{$cityName}','{$stateCode}','{$latitude}','{$longitude}','{$gmtTimeZone}','{$dstAdjustment}')";
			} else {
				$insertQueryValues .=",('{$id}','{$formatted_zipvalue}','{$cityName}','{$stateCode}','{$latitude}','{$longitude}','{$gmtTimeZone}','{$dstAdjustment}')";
			}
			$i++;
		}
		/*$checkInDB = $conn->query("SELECT varZipCode FROM `ci_dst_zipcode_gmt_timezone` WHERE varZipCode = '{$zip}'");
		if ( $checkInDB->num_rows == 0 ) {
			
			array_push($missingZip, array($formatted_zipvalue, $stateCode,$latitude,$longitude,$gmtTimeZone,$dstAdjustment));
			
		} else if ( $checkInDB->num_rows > 1 ) {
			array_push($duplicateZip, array($formatted_zipvalue, $stateCode,$latitude,$longitude,$gmtTimeZone,$dstAdjustment));
		}*/
	}
	echo $insertQuery.$insertQueryValues;
	if (strlen($insertQueryValues) > 0)
	{
		//Inserting data for ci_dst_zipcode_gmt_timezone table. 
		$stmt2 = $conn->query($insertQuery.$insertQueryValues);
		
	}
	//print_r('missingZip');
	//print_r($missingZip);
	//print_r('\n\n duplicateZip');
	//print_r($duplicateZip);
	//echo $insertValues;
	echo "Done";
    fclose($handle);
}
?>