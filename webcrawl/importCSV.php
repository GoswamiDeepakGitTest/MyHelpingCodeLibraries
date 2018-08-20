<?php
ini_set('max_execution_time', 0);

//Code to connect with Live "trucking_mileage" database for dno contact application
$servername = "localhost";
$username = "root";
$password = "";
$db_name = "test_holiday";
 
// Create connection
$conn = new mysqli($servername, $username, $password, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$CSVFilePath= 'E:\CustomDrive\htdocs\HelpingLibraries\webcrawl\country.csv';
$row = 1;
if (($handle = fopen($CSVFilePath, "r")) !== FALSE) {
	$missingZip = array();
	$duplicateZip = array();
	$insertQuery= "INSERT INTO `ci_country_data`(`varCountryFullName`, `intCountryReferenseId`, `dtAddDate`) VALUES";
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
		
		$refId = isset($data[0]) ? trim($data[0]) : '';
		$countryFullName = isset($data[1]) ? addslashes(trim($data[1])) : '';
		
		
		// If you got valid refId code value (i.e. not blank and not 0)
		if (!empty($refId))
		{
			
			// Code to create insert query for adding multiple rows at one time.
			if($i == 0){
				$insertQueryValues .= "('{$countryFullName}','{$refId}', NOW())";
			} else {
				$insertQueryValues .=",('{$countryFullName}','{$refId}', NOW())";
			}
			$i++;
		}
		 
	}
	echo $insertQuery.$insertQueryValues;
	if (strlen($insertQueryValues) > 0)
	{
		//Inserting data for ci_dst_zipcode_gmt_timezone table. 
		$stmt2 = $conn->query($insertQuery.$insertQueryValues." ON DUPLICATE KEY UPDATE dtAddDate=NOW()");
		
	}
	 
	echo "Done";
    fclose($handle);
}
?>