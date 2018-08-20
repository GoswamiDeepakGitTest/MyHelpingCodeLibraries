Database: test_holiday »Table:
CREATE TABLE `ci_country_data` (
 `bintUniqueId` bigint(20) NOT NULL AUTO_INCREMENT,
 `varCountryFullName` varchar(250) CHARACTER SET utf8 NOT NULL,
 `varCountryShortCode` varchar(250) CHARACTER SET utf8 NOT NULL,
 `intCountryReferenseId` int(20) NOT NULL,
 `dtAddDate` datetime NOT NULL,
 PRIMARY KEY (`bintUniqueId`),
 UNIQUE KEY `varCountryFullName` (`varCountryFullName`,`intCountryReferenseId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1

CREATE TABLE `ci_public_holiday_india` (
 `bintUniqueId` bigint(20) NOT NULL AUTO_INCREMENT,
 `varHolidayName` varchar(250) CHARACTER SET utf8 NOT NULL,
 `dtHolidayDate` date NOT NULL,
 `dtAddDate` datetime NOT NULL,
 PRIMARY KEY (`bintUniqueId`),
 UNIQUE KEY `varHolidayName` (`varHolidayName`,`dtHolidayDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1

CREATE TABLE `ci_public_holiday_usa` (
 `bintUniqueId` bigint(20) NOT NULL AUTO_INCREMENT,
 `varHolidayName` varchar(250) CHARACTER SET utf8 NOT NULL,
 `dtHolidayDate` date NOT NULL,
 `dtAddDate` datetime NOT NULL,
 PRIMARY KEY (`bintUniqueId`),
 UNIQUE KEY `varHolidayName` (`varHolidayName`,`dtHolidayDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1

CREATE TABLE `ci_holiday` (
 `bintId` int(11) NOT NULL AUTO_INCREMENT,
 `varHolidayName` varchar(250) CHARACTER SET utf8 NOT NULL,
 `dtHolidayDate` date NOT NULL,
 `bintOwnerId` bigint(20) NOT NULL,
 `dtAddDate` date NOT NULL,
 PRIMARY KEY (`bintId`),
 UNIQUE KEY `varHolidayName` (`varHolidayName`,`dtHolidayDate`,`bintOwnerId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1