#### Deepak Goswami ####
#### Some Useful Mysql Queries ####

#1 QUERY To Get Data from tables for given time interval (e.g. lets say last 24hours from now)
SELECT * FROM `<yourTable>` WHERE UNIX_TIMESTAMP(<date_added_field>) >= UNIX_TIMESTAMP(DATE_SUB(NOW(),INTERVAL 24 hour))

#2 QUERY To Insert or update on duplicate key (unique column fields) value query.
INSERT INTO `<yourTable>`(`id`,`uniqueField`, `dtCreationDate`) VALUES ('{$id}','{$uniqueField}',NOW()) ON DUPLICATE KEY UPDATE dtCreationDate=NOW()

#2 QUERY To Insert or update on duplicate key (unique column fields) value query With multiple rows.
INSERT INTO `ci_usa_public_holiday`(`varHolidayName`, `dtHolidayDate`, `dtAddDate`) VALUES('New Year\'s Day','2018-01-01', NOW()),('Martin Luther King Jr. Day','2018-01-15', NOW()),('Valentine\'s Day','2018-02-14', NOW()),('Presidents\' Day (Most regions)','2018-02-19', NOW()),('Easter Sunday','2018-04-01', NOW()),('Thomas Jefferson\'s Birthday','2018-04-13', NOW()),('Mother\'s Day','2018-05-13', NOW()),('Memorial Day','2018-05-28', NOW()),('Father\'s Day','2018-06-17', NOW()),('Independence Day','2018-07-04', NOW()),('Labor Day','2018-09-03', NOW()),('Columbus Day (Most regions)','2018-10-08', NOW()),('Halloween','2018-10-31', NOW()),('Veterans Day','2018-11-11', NOW()),('Veterans Day observed','2018-11-12', NOW()),('Thanksgiving Day','2018-11-22', NOW()),('Christmas Eve','2018-12-24', NOW()),('Christmas Day','2018-12-25', NOW()),('New Year\'s Eve','2018-12-31', NOW()) ON DUPLICATE KEY UPDATE dtAddDate=NOW()


### QUERY To Update Multiple Rows in single update query.
UPDATE <yourTable>
   SET <columnThatNeedToUpdate> = CASE <uniqueIdColumn>
	  WHEN 16 THEN 'value1'  
	  WHEN 17 THEN 'value2' 
	  WHEN 18 THEN 'value3' 
	  ELSE <columnThatNeedToUpdate>
	  END
 WHERE <uniqueIdColumn> IN(16, 17, 18);
 
 
 
### QUERY To Update Multiple Columns And Rows in single update query using MySQL update CASE WHEN/THEN/ELSE.
UPDATE `tbl_display_quote_history`
  SET varMsg = CASE bintId 
                      WHEN 16 THEN 'value11' 
                      WHEN 17 THEN 'value22' 
                      WHEN 18 THEN 'value33' 
                      ELSE varMsg 
					  END,
  enumImageDisplayed = CASE bintId 
                      WHEN 16 THEN 'no' 
                      WHEN 17 THEN 'yes' 
                      WHEN 18 THEN 'no' 
                      ELSE enumImageDisplayed
                      END
 WHERE bintId IN(16, 17, 18);

 
### QUERY To GROUP CONCAT WITH DISTINCT AND ORDER BY ######
SELECT GROUP_CONCAT(DISTINCT varZipcode ORDER BY varZipcode SEPARATOR ',') FROM `ci_cron_dst_error_log` GROUP BY bintOwnerId
 
### QUERY To GET Time diffrence in minutes b/w gievn two start and end dates ######
SELECT TIMESTAMPDIFF(MINUTE,dtCronStartDate, NOW()) AS timeInMinute FROM `ci_cron_dst_status_log` ORDER BY bintUniqueId DESC LIMIT 1


### QUERY To Deleting all rows older than 15 days ######
DELETE FROM `ci_cron_send_notification_status_log` WHERE DATEDIFF(NOW(), dtCronStartDate) > 15 
 

### QUERY To Deleting rows from multipl tables based on left join on and refrence key id ######
### Deleting rows from both ci_terminal and  tbl_spot tables ######
DELETE T, S FROM `ci_terminal` AS T LEFT JOIN tbl_spot AS S ON S.terminal_id = T.bintId WHERE T.`bintId` = 138
 
 