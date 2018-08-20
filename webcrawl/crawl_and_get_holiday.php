<?php 

require(__DIR__."/symfony/vendor/autoload.php");
use Symfony\Component\DomCrawler\Crawler;
 
// Using Symfony Web crawler get data of html table td columns by table id or class.
function crawl_page_by_symfony_crawler($your_url='', $filterElementCondition="td[@class='vt']/table")
{
	// Running this PHP script for unlimited time.
	ini_set('max_execution_time', 0);
	
	// Set up $html with blank if undefined.	
	$html = '';
	
	// If $your_url != '', do this.
	if ($your_url != '')
	{
		// Getting web page html content of $your_url page.
		@$html = file_get_contents($your_url);
	}
	 
	$tableRowsData = array();
	if (!empty($html)) 
	{
		// Initializing symfony crawler object to use its functions
		$crawler = new Crawler();
		@$crawler->addHTMLContent($html);
				
		// $tr_elements = $crawler->filterXPath('//table/tr');
		//$tr_elements = $crawler->filterXPath('//td[@id="vt"]/table');
		
		// Filter & get data of given td column by class name.
		@$tr_elements = $crawler->filterXPath("//{$filterElementCondition}");
		
		// Iterate over filter results
		foreach ($tr_elements as $i => $content) 
		{
			$tableColumnsData = array();
			
			// create crawler instance for result
			@$crawler = new Crawler($content);
			
			//iterate again
			foreach ($crawler->filter('td') as $i => $node) 
			{
				// extract the value
				@$tableColumnsData[] = $node->nodeValue;
				//echo $node->nodeValue;
			}
			 
			// Push  td columns row data into $tableRowsData array.
			$tableRowsData[] = $tableColumnsData;
		}
	}
	
	return $tableRowsData;
}

//Split an array into chunks to convert response array into holiday date and name.
function convert_response_array_into_holiday_date_and_name($responseData)
{
	$finalData =array();
	if (count($responseData) > 0)
	{
		foreach($responseData as $row)
		{
			if (count($row) > 0)
			{
				// Divide array in chunks of holiday date and name.
				$tempData = array_chunk($row, 2);
				if (count($tempData) > 0)
				{
					foreach($tempData as $holday)
					{
						array_push($finalData, $holday);
					}
				}
			}
		}
	}
	
	return $finalData;
} 

function crawler_add_holiday_in_database($year='')
{
	global $conn;
	global $tblName;
	$status = 0;
	if ($year =='')
		return $status;
	
	$your_url = "https://www.timeanddate.com/calendar/?year={$year}&country=1"; // USA
	
	/*
	//$your_url = "https://www.timeanddate.com/calendar/custom.html?year={$year}&country=35&hol=9&df=1&lang=hi"; // INDIA in hindi
	$your_url = "https://www.timeanddate.com/calendar/custom.html?year={$year}&country=35&hol=9&df=1&lang=en"; // INDIA in English
	
	//$your_url = "https://www.timeanddate.com/calendar/custom.html?year=2011&y2=2013&months=&country=35&typ=3&display=3&cols=0&lang=en&cdt=1&df=1"; //(for two or three year only.)
	*/
	
	@$responseData = crawl_page_by_symfony_crawler($your_url);
	@$finalData = convert_response_array_into_holiday_date_and_name($responseData);
	
	
	// If you got (count($finalData) > 0 ) , do this.
	if (count($finalData) > 0 )
	{
		// Save holiday data into ci_public_holiday_india table.
		$insertHolidayQuery= "INSERT INTO {$tblName} (`varHolidayName`, `dtHolidayDate`, `dtAddDate`) VALUES";
		
		$insertQueryValues='';$tempCount=0;
		foreach($finalData as $row)
		{
			$holidayDate = (!empty($row[0]))? trim($row[0]).' '. $year : '';
			$holidayName = (!empty($row[1]))? addslashes(trim($row[1])) : '';
			
			if (strtotime($holidayDate) == FALSE)
			{
				// invalid date.
			} else
			{
				$holidayDate = date('Y-m-d', strtotime($holidayDate));
				
				// Code to create insert query for adding multiple rows at one time.
				if($tempCount == 0){
					$insertQueryValues .= "('{$holidayName}','{$holidayDate}', NOW())";
				} else {
					$insertQueryValues .=",('{$holidayName}','{$holidayDate}', NOW())";
				}
				$tempCount++;
			}
		}
		if (strlen($insertQueryValues) > 0)
		{
			//Inserting data for ci_dst_zipcode_gmt_timezone table. 
			$status = $conn->query($insertHolidayQuery.$insertQueryValues." ON DUPLICATE KEY UPDATE dtAddDate=NOW()");
			//echo $insertHolidayQuery.$insertQueryValues." ON DUPLICATE KEY UPDATE dtAddDate=NOW()";
			 
		}
	} else
	{
		$status = -2;
	}
	return $status;
}
 
 

// Connect DATABASE
$servername = "localhost";
$username = "root";
$password = "";
$db_name = "test_holiday";
$tblName = "ci_public_holiday_usa";
$cuntryName = "ci_public_holiday_usa";
$cuntryName = "usa";
$cuntryCode = "1";
$countryData = array(array('cuntryFullName'=>'United States','cuntryShortName'=>'usa','cuntryCode'=>'1'));
// Create connection
$conn = new mysqli($servername, $username, $password, $db_name);

// Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
} 

if (count($countryData) > 0)
{
	foreach($countryData as $row)
	{
		
	}
}
 
$createHolidayTableQuery = "CREATE TABLE IF NOT EXISTS `ci_public_holiday_india` (
 `bintUniqueId` bigint(20) NOT NULL AUTO_INCREMENT,
 `varHolidayName` varchar(250) CHARACTER SET utf8 NOT NULL,
 `dtHolidayDate` date NOT NULL,
 `dtAddDate` datetime NOT NULL,
 PRIMARY KEY (`bintUniqueId`),
 UNIQUE KEY `varHolidayName` (`varHolidayName`,`dtHolidayDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1";
$holidayYearData = array();
$checkUsHolidayInDB = $conn->query("SELECT DISTINCT YEAR(dtHolidayDate) AS HolidayYear FROM {$tblName} ORDER BY HolidayYear ASC");

if ( $checkUsHolidayInDB->num_rows > 0) 
{
	while ( $row = $checkUsHolidayInDB->fetch_assoc() )
	{
		
		$holidayYearData[] = $row['HolidayYear'];
		
	}
}
  
// Current year;
//$current_year = date('Y');
$current_year = date("Y",strtotime("-50 year")); // Get holiday data for 10 year back and forward.
//echo 'current_year:'.$current_year;
$newYear=$current_year;
if ($current_year > 0)
{
	for($i=0;$i<=100;$i++)
	{
		if ($i>0)
		{
			$newYear = $newYear+1;
		}
		 
		if (!in_array($newYear, $holidayYearData))
		{
			@$status = crawler_add_holiday_in_database($newYear);
			if ($status > 0)
			{
				echo "<br/>Holiday data added in our database for {$newYear} year.";
			} else if ($status == -2)
			{
				echo "<br/>Error: Holiday data for {$newYear} year not found on server so could not be added in our database.";
			} else 
			{
				echo "<br/>Error: Holiday data could not added in our database for {$newYear} year.";
			}
		} else
		{
			echo "<br/>Holiday data already found in our database for {$newYear} year.";
		}
		 
	}
}
	 
$conn->close();
?>