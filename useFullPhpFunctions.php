<?php
/**
  * @Function: deleteAllFilesOlderThanGivenDays()
  * @Description: Function to delete all files older than given number of days from given folder directory.
  * @return: status json array info 
  * @developer: Deepak Goswami < deepak.goswami@gaurish.com >
  * @date: 14/06/2017
  * @lastModified: 
  * 
*/	
 
function deleteAllFilesOlderThanGivenDays($dirPath = "", $dayCount=10) 
{
	$files = glob($dirPath."/*");
	$now   = time();
	foreach ($files as $file) 
	{
		if (is_file($file)) 
		{
			$dd = intval(filemtime($file));
			
			if (($now - $dd) >= (60 * 60 * 24 * $dayCount)) 
			{ 
				// Delete file.
				unlink($file);
			} else
				
				{
					echo  "not";
				}
		}
	}
}
	 $fn = 'C:/Users/Deepak/Desktop/tmp/New/a.jpg';    
 $newfn = 'C:/Users/Deepak/Desktop/tmp/New/a/a.jpg'; 
 
 if(copy($fn,$newfn))
 echo 'The file was copied successfully';
 else
 echo 'An error occurred during copying the file';
deleteAllFilesOlderThanGivenDays( "C:/Users/Deepak/Desktop/tmp/New/" , 1);
?>