/**
*This page is coded on 24-Jan-2013 
*for sake of re-usability of form validations and other functions
*Last Updated date 27-Jun-2018
*
*For using this validation just add classes for respective checks like 
*	for restricting not-blank add class 'blk',
*	for restricting minimum length add class 'len' and add an attribute as `min`  in input field for minimum length of that field required, 
*	for restricting only alphabet add class 'alpha', 
*	for restricting alphabet with space add class 'alphaWthSpc', 
*	for restricting only number add class 'num',
*	for restricting only alpha & number add class 'alphaNum',
*	for restricting only alpha & number with space add class 'alphaNumWthSpc',
*	for restricting numbers with dot means floating points numbers add class 'dblNum',
*	for creating own custom restriction in adding with 'alphaNumWthSpc' you can use function alphaNumCheck() check function below for more information to use it
*	for restricting at-least one check-box checked add same name to all of them & add class 'chkbx' to all of them
*	for password check just place 'conPass' class on confirm password field & 'newPass' on password field to match
*	for password validation check just place 'vldtPass' on password field to check rules
*	for time check just add class 'tmChk' on input field
*	for URL check just add class 'vldUrl' on input field, it will check if valid URL is given or not
*	for radio check just add class 'chkRadio' on input field, and it will validate if radio is checked or not
*	for error message to be displayed just add div to all respective fields with id in format: 'err_<id>' here `id` is your field `id` like I have field with `id` fName so the error div `id` would be 'err_fName'
*	For checking all validation call subCheck(), it returns true (success) or false (fail)
*
*	Function 'callServer' can be used to make server calls in less code and efforts the function signature definition is given with the function
*	Function 'confirmed' can be used to make custom alert or confirm popup function signature definition is given with the function
*	Function 'inArray' can be used to search values in array including index names function signature definition is given with the function
*	Function 'getFocus' can be used to take focus to elements function signature definition is given with the function
*/

  
/* Variable to change for sake of customization */	

var subChkErrMsg = 'Please check on above errors in red!', 
	blkErrMsg = "This Field is required!",
	blkFileErrMsg = "Please choose File to upload!", 
	numErrMsg = "Only Numbers are allowed!",
	decNumErrMsg = "Only Numbers or Decimal numbers are allowed!",
	alphaErrMsg = "Only Alphabets are allowed!", 
	alphaNumErrMsg = "Only Alphabets or numbers are allowed!", 
	emailErrMsg = "Not a valid E-mail address!", 
	passMatchErrMsg = "Password does not match!", 
	validatePassErrMsg = "Password does not match specified format, please check rules!", 
	chkBoxErrMsg = "Please check at-least one!",
	urlErrMsg = "Please provide a valid URL!",
	radioErrMsg = "Please select at-least one option!",
	defErrClass = 'error',
	defaultErrMsgDivId = 'errMsg', 
	defTimeOut = 2000000,
	defMethodType = 'POST', 
	successFtn = function(str){	$('#loader').addClass("hide"); $('#content').html(str);};

/* End of Variables list to change for sake of customization */
  
/** Start of DOM Ready function */
$(document).ready(function(){

	$(document.body).on('blur', '.blk', function(){
		var eId = $(this).attr('id'), clas = $(this).attr('class').split(" ");
		var check = checkBlank(eId);
		if (check == false) {
			return false;
		}
		if (inArray('len', clas)) {
			return checkLength(eId);
		}
	});
	
	$(document.body).on('blur', '.tmChk', function(){
		return timeCheck($(this).attr('id'));
	});
	
	$(document.body).on('blur', '.blkFile', function(){
		var eId = $(this).attr('id'), clas = $(this).attr('class').split(" ");
		return checkBlankFile(eId);
	});
	
	$(document.body).on('keypress', '.alpha', function(event){
		var eId = $(this).attr('id');
		return alphaCheck(event, eId);
	});
	
	$(document.body).on('keypress', '.alphaWthSpc', function(event){
		var eId = $(this).attr('id');
		return alphaCheck(event, eId, 2);
	});
	
	$(document.body).on('keypress', '.num', function(event){
		var eId = $(this).attr('id');
		return numCheck(event, eId);
	});
	
	$(document.body).on('keypress', '.dblNum', function(event){
		var eId = $(this).attr('id');
		return numCheck(event, eId, 2);
	});
	
	$(document.body).on('keypress', '.alphaNum', function(event){
		var eId = $(this).attr('id');
		return alphaNumCheck(event, eId, 1);
	});
	
	$(document.body).on('keypress', '.alphaNumWthSpc', function(event){
		var eId = $(this).attr('id');
		return alphaNumCheck(event, eId, 2);
	});
	
	$(document.body).on('paste blur', '.alpha', function(e){
		var that = this;
		setTimeout(function() {
			$(that).val($(that).val().replace(/[^A-Za-z]/g, ''));
		}, 0);
	});
	
	$(document.body).on('paste blur', '.alphaWthSpc', function(e){
		var that = this;
		setTimeout(function() {
			$(that).val($(that).val().replace(/[^A-Za-z ]/g, ''));
		}, 0);
	});
	
	$(document.body).on('paste blur', '.num', function(){
		var that = this;
		setTimeout(function() {
			$(that).val($(that).val().replace(/[^0-9]/g, ''));
		}, 0);
	});
	
	$(document.body).on('paste blur', '.dblNum', function(){
		var that = this;
		setTimeout(function() {
			$(that).val($(that).val().replace(/[^0-9.]/g, ''));
		}, 0);
	});
	
	$(document.body).on('paste blur', '.alphaNum', function(){
		var that = this;
		setTimeout(function() {
			var cstm = $(that).attr('data-cstm') || "";
			$(that).val($(that).val().replace(new RegExp('[^A-Za-z0-9' + cstm.replace(/[\]^\\-]/g, '\\$&') + ']+', 'g'), ''));
		}, 0);
	});
	
	$(document.body).on('paste blur', '.alphaNumWthSpc', function(){
		var that = this;
		setTimeout(function() {
			var cstm = $(that).attr('data-cstm') || "";
			$(that).val($(that).val().replace(new RegExp('[^A-Za-z0-9 ' + cstm.replace(/[\]^\\-]/g, '\\$&') + ']+', 'g'), ''));
		}, 0);
	});
	
	$(document.body).on('blur', '.conPass', function(){
		return confirmPassword();
	});
	
	$(document.body).on('blur', '.vldtPass', function(){
		return validatePassword($(this).attr('id'));
	});
	
	$(document.body).on('blur', '.eMail', function(){
		return checkEmail($(this).attr('id'));
	});
	
	$(document.body).on('blur', '.vldUrl', function(){
		return isValidUrl($(this).attr('id'));
	});
	
	$(document.body).on('focus mouseover', '.chkRadio', function(){
		return checkRadioBox($(this).attr('name'));
	});
	
	$(document.body).on('focus mouseover', '.chkbx', function(){
		return checkChkBox("", "");
	});
	
	$(document.body).on('click', '.chkBxGrp', function(){
		$('[name=' + $(this).val() + ']').prop('indeterminate', false);
		$('[name=' + $(this).val() + ']').prop('checked', $(this).prop("checked"));
		$('.'+$(this).val()).prop('checked', $(this).prop("checked"));	
	});
		
	$(document.body).on('click', '.chkBxOne, .chkBxSingle', function(){
		var name = $(this).attr('name'), cnt = $('[name=' + name + ']:checked').length, rel = $(this).attr('rel'), cnt2 = $('.chkBxSingle[rel=' + rel + ']:checked').length;
	
		if (cnt2 == 0) {
			$('.chkBxSubOne[rel=' + rel + ']').prop('checked', '');
			$('.chkBxSubOne[rel=' + rel + ']').prop('indeterminate', false);
		} else {
			if ( cnt2 == $('.chkBxSingle[rel=' + rel + ']').length ) {
				$('.chkBxSubOne[rel=' + rel + ']').prop('indeterminate', false);
				$('.chkBxSubOne[rel=' + rel + ']').prop('checked', 'checked');
			} else
				$('.chkBxSubOne[rel=' + rel + ']').prop('indeterminate', true);
				
		}
		if (cnt == 0) {
			$('.chkBxGrp[value=' + name + ']').prop('checked', '');
			$('.chkBxGrp[value=' + name + ']').prop('indeterminate', false);
		} else {
			if ( $('[name=' + name + ']:checked').length == $('[name=' + name + ']').length ) {
				$('.chkBxGrp[value=' + name + ']').prop('indeterminate', false);
				$('.chkBxGrp[value=' + name + ']').prop('checked', 'checked');
			} else
				$('.chkBxGrp[value=' + name + ']').prop('indeterminate', true);
				
		}
		$('[name=' + $(this).val() + ']').prop('checked', $(this).prop("checked"));
	});
		
	$(document.body).on('click', '.chkBxSubOne', function(){
		
		var rel = $(this).attr('rel'), cnt = $('[rel=' + rel + ']:checked').length,
		name = $(this).attr('name'), cnt2 = $('.chkBxSubOne:checked').length;
		$('.chkBxSingle[rel=' + rel + ']').prop('checked', $(this).prop("checked"));
		if (cnt == 0) {
			$('.chkBxGrp[value=' + name + ']').prop('checked', '');
			$('.chkBxGrp[value=' + name + ']').prop('indeterminate', false);
			$('.chkBxSingle[name=' + name+ ']').prop('checked', '');
		} else {
			if ( cnt2 == $('.chkBxSubOne[name=' + name + ']').length ) {
				$('.chkBxGrp[value=' + name + ']').prop('indeterminate', false);
				$('.chkBxGrp[value=' + name + ']').prop('checked', 'checked');
				$('.chkBxSingle[name=' + name+ ']').prop('checked', 'checked');
			} else{
				$('.chkBxGrp[value=' + name + ']').prop('indeterminate', true);
			}
		}	
	});
});	
	var isMobile = false; //initiate as false
	// device detection
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
		|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
	
/** End of DOM Ready function */

/**
 * callServer (url, msgDiv, dataToSend, successFn, type, beforeFtn)
 * url			- 	URL to call like http://mydomain.com/controller/function/ mandatory field
 * msgDiv		- 	div id in which the error msg or loading messages are to be appended, default errMsg
 * dataToSend 	-	data array to be sent to server default blank array
 * successFn	-	success function can be overridden for the URL call 
 * type			-	server response type, default is HTML, other option is JSON
 * beforeFtn	-	beforeSend function can be overridden for loader 
 */	
 
function callServer(url, msgDiv, dataToSend, successFn, type, beforeFtn) {
	type = ((type == undefined) ? 'html' : type);
	dataToSend = (dataToSend == undefined) ? {} : dataToSend;
	msgDiv = (msgDiv == undefined) ? defaultErrMsgDivId : msgDiv;
	beforeFtn=beforeFtn==undefined?function(){$('#loader').removeClass("hide");}:beforeFtn;
	successFn=((successFn==undefined)?successFtn:successFn);
	$.ajax({
		url: url,
		data: dataToSend,
		type: defMethodType,
		dataType: type,
		timeout: defTimeOut,
		beforeSend: beforeFtn,
		error: function(){$('#loader').addClass("hide");$('#'+msgDiv).html('<div class="alert-msg error">Request couldn\'t be processed!<a class="close closeMsg"  href="javascript:;">X</a></div>');},
		success: successFn,
		complete: function(){$('#loader').addClass("hide");}
	});
} 

/**
 * inArray(needle, haystack) is custom function to check needle which also matches index 
 * names for finding needle, and values are definitely matched
 */	

function inArray(needle, haystack) {
	if (needle != undefined && haystack != undefined && $.isArray(haystack)) {
		if (needle in haystack) {
			return true;
		}
		for (var item in haystack) {
			if (haystack[item] == needle || ((haystack[item] instanceof Array) && 
				inArray(needle, haystack[item]))
			) {
				return true;
			}
		}
	}
    return false;
}

/**
  * subCheck(inBlock) takes optional argument, 
  * this argument can be anything an id (#inputId) or class (.inputClass) or etc
  * you can pass [:visible] with your id (#inputId:visible) or class (.inputClass:visible)
  * or simply visible to perform validation check on only visible inputs
  */

function subCheck(inBlock, errDiv, errMsg) {
	inBlock = (inBlock == undefined) ? '' : inBlock;
	errDiv = ((errDiv == undefined || errDiv == '') ? 'err_subCheck' : errDiv);
	var ids = [], classes = [], check = false, count = 0, chkMail = true, visible = '', enable = '';
	
	if	($.trim(inBlock).indexOf(':visible', -8 ) > -1) {
		visible = ":visible";
		inBlock = inBlock.replace(':visible', '');
	}
	
	if	($.trim(inBlock).indexOf(':enabled', -8 ) > -1) {
		visible += ":enabled";
		inBlock = inBlock.replace(':enabled', '');
	}
	
	$(inBlock + ' .alpha' + visible).each(function(){
		$(this).val($(this).val().replace(/[^A-Za-z]/g, ''));
	});
	
	$(inBlock + ' .alphaWthSpc' + visible).each(function(){
		$(this).val($(this).val().replace(/[^A-Za-z ]/g, ''));
	});
	
	$(inBlock + ' .num' + visible).each(function(){
		$(this).val($(this).val().replace(/[^0-9]/g, ''));
	});
	
	$(inBlock + ' .dblNum' + visible).each(function(){
		$(this).val($(this).val().replace(/[^0-9.]/g, ''));
	});
	
	$(inBlock + ' .alphaNum' + visible).each(function(){
		var cstm = $(this).attr('data-cstm') || "";
		$(this).val($(this).val().replace(new RegExp('[^A-Za-z0-9' + cstm.replace(/[\]^\\-]/g, '\\$&') + ']+', 'g'), ''));
	});
	
	$(inBlock + ' .alphaNumWthSpc' + visible).each(function(){
		var cstm = $(this).attr('data-cstm') || "";
		$(this).val($(this).val().replace(new RegExp('[^A-Za-z0-9 ' + cstm.replace(/[\]^\\-]/g, '\\$&') + ']+', 'g'), ''));
	});
	
	$(inBlock + ' .blk' + visible).each(function() {
		var chkEnable = (enable==":enabled") ? $(this).is(enable) : true;
		if(chkEnable) {
			ids.push($(this).attr('id'));
		}
	});

	for (var i = 0; i < ids.length; i++) {
		classes = $(inBlock + ' #'+ids[i] + visible).attr('class').split(" ");
		check = checkBlank(ids[i]);
		if (check == false) {
			count++;
		} else {
			if (inArray('len', classes)) {
				if (!checkLength(ids[i])) {
					count++;
				}
			}
		}
	}
	
	$(inBlock + ' .blkFile' + visible).each(function(){
		if (!checkBlankFile($(this).attr('id'))) {
			count++;
		}
	});

	$(inBlock + ' .tmChk' + visible).each(function(){
		if (!timeCheck($(this).attr('id'))) {
			count++;
		}
	});
	
	$(inBlock + ' .vldtPass' + visible).each(function(){
		if (!validatePassword($(this).attr('id'))) {
			count++;
		}
	});
	
	$(inBlock + ' .vldUrl' + visible).each(function(){
		if (!isValidUrl($(this).attr('id'))) {
			count++;
		}
	});
	
	$(inBlock + ' .chkRadio' + visible).each(function(){
		if (!checkRadioBox($(this).attr('name'))) {
			count++;
		}
	});
	
	$(inBlock + ' .eMail' + visible).each(function(){
		if (!checkEmail($(this).attr('id'))) {
			count++;
		}
	});
	
	chkbx = checkChkBox(inBlock, visible);
	cnfPwd = confirmPassword(inBlock, visible);
	
	if (!(chkMail && chkbx && cnfPwd)) {
		count++;
	}
	
	if (count > 0) {
		$('#'+errDiv).html(errMsg);
		return false;
	} else {
		$('#'+errDiv).html(' ');
		return true;
	}
}

function checkBlank(eId, errBlk, errMsg){
	var eValue = $.trim($('#' + eId).val()), type =$('#' + eId).prop("tagName");
	if (type != 'SELECT') {
		$('#' + eId).val(eValue);
	}
	errMsg = (errMsg == undefined ? blkErrMsg : errMsg);
	errBlk = (errBlk == undefined ? '#err_' + eId: errBlk);
	if (eValue == "" || eValue == null) {
		$('#' + eId).addClass(defErrClass);
		$(errBlk).html(errMsg);
		return false;
	} else {
		$('#' + eId).removeClass(defErrClass);
		$(errBlk).html(" ");
		return true;
	}
}

function checkBlankFile(eId, attr, errBlk, errMsg) {
	var val = $.trim($('#' + eId).val()), attrb = (attr == undefined ? 'rel' : attr), 
		eValue = ( val != "" ? val : $.trim($('#' + eId).attr(attrb)) );
	errMsg = (errMsg == undefined ? blkFileErrMsg : errMsg);
	errBlk = (errBlk == undefined ? '#err_' + eId : errBlk);
	if (eValue == "" || eValue == null) {
		$('#' + eId).addClass(defErrClass);
		$(errBlk).html(errMsg);
		return false;
	} else {
		$('#' + eId).removeClass(defErrClass);
		$(errBlk).html(" ");
		return true;
	}
}

function checkLength(eId, errBlk, errMsg) {
	var eValue = $.trim($('#' + eId).val()).length, len = $('#' + eId).attr('min');
	errBlk = (errBlk == undefined ? '#err_' + eId : errBlk);
	if (eValue+1 <= len){
		$('#' + eId).addClass(defErrClass);
		$(errBlk).html("Atleast "+len+" character required!");
		return false;
	} else {
		$('#' + eId).removeClass(defErrClass);
		$(errBlk).html(" ");
		return true;
	}
}

/**
  * alphaNumCheck(event, eId, type, errDiv, errMsg, cstm)
  * This function takes its 6th optional argument `cstm` as custom regular expression 
  * if you would like to add some with alphabet and number check
  */

function alphaNumCheck(event, eId, type, errDiv, errMsg, cstm) {
	var asciiCode = event.which ? event.which : event.charCode;
	type = (type == undefined) ? 1 : type;
	errMsg = (errMsg == undefined ? alphaNumErrMsg : errMsg);
	errDiv = (errDiv == undefined ? '#err_' + eId : errDiv);
	cstm = (cstm == undefined ? $('#'+eId).attr('data-cstm') : cstm);
	var str = String.fromCharCode(asciiCode);
	var strToVal = new RegExp('^[a-zA-Z0-9' + cstm + ']+$');
    if (strToVal.test(str) || asciiCode == 8 || asciiCode == 0 || asciiCode == 118 || 
		asciiCode == 99 || (type == 2 && asciiCode == 32)
	) {
        $('#' + eId).removeClass(defErrClass);
		$(errDiv).html(" ");
		return true;
    }
	$('#' + eId).addClass(defErrClass);
	$(errDiv).html(errMsg);
    event.preventDefault();
    return false;
}

function alphaCheck(event, eId, type, errBlk, errMsg) {
	var asciiCode = event.which ? event.which : event.charCode;
	type = (type == undefined) ? 1 : type;
	errMsg = (errMsg == undefined ? alphaErrMsg : errMsg);
	errBlk = (errBlk == undefined ? '#err_' + eId : errBlk);
	if ( !((asciiCode >= 65 && asciiCode <= 90) || (asciiCode >= 97 && asciiCode <= 122) 
		|| asciiCode == 8 || asciiCode == 0 || asciiCode == 118 || asciiCode == 99 || 
		(type == 2 && asciiCode == 32))
	) {
		$('#' + eId).addClass(defErrClass);
		$(errBlk).html(errMsg);
		return false;
	} else {
		$('#' + eId).removeClass(defErrClass);
		$(errBlk).html(" ");
		return true;
	}
}

function numCheck(event, eId, type, errBlk, errMsg) {
	var asciiCode=event.which;
	var detectCtrl= event.ctrlKey;
	var hasDot = $('#'+eId).val().indexOf('.');
	type=(type==undefined)?1:type;
	errMsg=(errMsg==undefined?(type==1?numErrMsg:decNumErrMsg):errMsg);
	errBlk=(errBlk==undefined?'#err_'+eId:errBlk);
	if(!((asciiCode>=48 && asciiCode<=57) || asciiCode==8 || asciiCode==0 || (asciiCode==118 && detectCtrl) || (asciiCode==99 && detectCtrl) || (type==2 && hasDot==-1 && asciiCode==46)) ) {
		$('#'+eId).addClass(defErrClass);
		$(errBlk).html(errMsg);
		return false;
	} else {
		$('#'+eId).removeClass(defErrClass);
		$(errBlk).html(" ");
		return true;
	}
}

/**
 * validatePassword(eId, errDiv, errMsg)
 * This function will be used to validate password on conditions: Minimum 8 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character
 * Other options are also listed below
 * Minimum 8 characters at least 1 Alphabet and 1 Number:
	"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
 * Minimum 8 characters at least 1 Alphabet, 1 Number and 1 Special Character:
	"^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$"
 * Minimum 8 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet and 1 Number:
	"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
 * Minimum 8 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character:
	"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
 * Minimum 8 and Maximum 10 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character:
	"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,10}"
  */

function validatePassword(eId, errDiv, errMsg) {
	
	errMsg = (errMsg == undefined ? validatePassErrMsg : errMsg);
	errDiv = (errDiv == undefined ? '#err_' + eId : errDiv);

	var strToVal = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
	var toTest = $('#'+eId).val();
	
    if ( strToVal.test(toTest) ) {
        $('#' + eId).removeClass(defErrClass);
		$(errDiv).html(" ");
		return true;
    }
	
	$('#' + eId).addClass(defErrClass);
	$(errDiv).html(errMsg);
    return false;
	
}

function confirmPassword(inBlock, visible) {
	inBlock = (inBlock == undefined ? "" : inBlock);
	visible = (visible == undefined ? "" : visible);
	if ($(inBlock + ' input' + visible).hasClass('newPass') && 
		$(inBlock + ' input' + visible).hasClass('conPass')
	) {
		var cnPss = $(inBlock + ' input.conPass' + visible), cPassVal = cnPss.val(),
			passVal = $(inBlock + ' input.newPass' + visible).val();
		if (passVal != cPassVal) {
			$('.conPass').addClass(defErrClass);
			$('#err_' + cnPss.attr('id')).html(passMatchErrMsg);
			return false;
		} else {
			$('.conPass').removeClass(defErrClass);
			$('#err_' + cnPss.attr('id')).html(" ");
			return true;
		}
	}
	return true;
}

function checkEmail(eId, errBlk, errMsg){
	var Email = $.trim($('#' + eId).val()), 
		filter = /^[A-z0-9]+[A-z0-9._-]+@[A-z0-9]+[A-z0-9.-]+\.[A-z]{2,4}$/;
	errMsg = (errMsg == undefined ? emailErrMsg : errMsg);
	errBlk = (errBlk == undefined ? '#err_' + eId : errBlk);
	if (Email != '') {
		if (!filter.test(Email)) {
			$('#' + eId).addClass(defErrClass);
			$(errBlk).html(errMsg);
			return false;
		} else {
			$('#' + eId).removeClass(defErrClass);
			$(errBlk).html(" ");
			return true;
		}
	} else {
		return true;
	}
}

/**
* call this function on submit button or on focus of something
*/
function checkChkBox(inBlock, visible) {
	var i = 0, j = 0, k = 0, val = [], name = [], mul = [], pos = [], flag = false, err = 0;
	$(inBlock + ' input[type="checkbox"].chkbx' + visible).each(function(){
		name[i] = $(this).attr('name');
		val[i] = $(this).is(':checked');
		if (i > 0) {
			if (mul[k] != name[i]) {
				k++;
				pos[k] = i;
				mul.push(name[i]);
			}
		} else {
			mul[0] = name[0];
			pos[0] = i;
		}
		i++;
	});
	pos.push(i);
	while (j < mul.length) {
		min = pos[j]; max = pos[j + 1];
		while (min < max) {
			if (val[min]) {
				flag = true;
			}
			min++;
		}
		
		if (flag) {
			$('#err_' + name[pos[j]]).html(" ");
		} else {
			err++;
			$('#err_' + name[pos[j]]).html("Please check at-least one");	
		}
		j++;
	}
	if (err>0) {
		return false;
	}
	return true;
}

function timeCheck(eId)
{
	var time = $.trim($('#' + eId).val()), 
		filter =/^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/i;
	if (!filter.test(time)) {
		$('#' + eId).addClass(defErrClass);
		$('#err_' + eId).html("Not a valid time format");
		return false;
	} else {
		$('#' + eId).removeClass(defErrClass);
		$('#err_' + eId).html(" ");
		return true;
	}
}


/**
  * confirmed(type, msg, okFtn, cnclFtn) takes four arguments
  * type - Defines single button (Alert type=1) or double button (confirm type=2) popup [mandatory] default is confirm type
  * msg - it takes custom messages including html to show on popup [mandatory]
  * okFtn - Takes function, which would be called if 'OK' button is clicked [optional]
  * cnclBtn - Takes function, which would be called if 'Cancel' button is clicked [optional]
  * [Note: you need to define CSS formatting for this popup internal container] 
  */
var modalPopupCount = 0;
function confirmed(type, msg, okFtn, cnclFtn,okBtnName='OK', cancelBtnName='Cancel') 
{
	var cnclBtn = '';
	modalPopupCount++;
	
	if (type == undefined || type == 2)
		cnclBtn = '<button value="no" class="btn btn-default cnfrm" id="modal_cncl_btn_'+modalPopupCount+'"><i class="glyphicon glyphicon-remove"></i> '+cancelBtnName+'</button>';
	
	$('<div id="myModal'+modalPopupCount+'" class="modal fade"></div>').appendTo('body');
	
	$("#myModal"+modalPopupCount).html('\
			<div class="modal-dialog">\
				<div class="modal-content">\
					' + msg + '\
					<div class="modal-footer">\
					   ' + cnclBtn + '\
						<button value="yes" class="btn btn-primary cnfrm" id="modal_ok_btn_'+modalPopupCount+'"><i class="glyphicon glyphicon-ok"></i> '+okBtnName+'</button>\
					</div>\
				</div>\
	</div>');
	
	$('#myModal'+modalPopupCount).modal({backdrop: 'static', keyboard: false});	
	$("#myModal"+modalPopupCount).modal('show');

	$('#myModal'+modalPopupCount).on('hidden.bs.modal', function () {
		$(this).remove();
	});
	
	$("#myModal"+modalPopupCount+" button.cnfrm").click(function(){
		var modalId = $(this).attr("id").split("_btn_")[1];
		$("#myModal"+modalId).empty();
		$("#myModal"+modalId).modal('hide');
		if ($(this).val() == 'yes') {
			if (okFtn && typeof okFtn === 'function') {
				okFtn();
			}
		} else {
			if (cnclFtn && typeof cnclFtn === 'function') {
				cnclFtn();
			}
		}
	});
}

function alrtMsg(msgTyp, ttlMsg, bdyMsg, okFtn, cnclFtn, okBtnName='OK', cancelBtnName='Cancel') {
	var msg = '', hdCls = msgTyp == 1 ? 'glyphicon-ok-sign' : 'glyphicon-warning-sign', 
		bdyCls = msgTyp == 1 ? 'text-success' : (msgTyp == 2 ? 'text-danger' : '');
	msg = '<div class="modal-header">\
			<h4 class="modal-title text-info"><i class="glyphicon ' + hdCls + '"></i> '+ttlMsg+'</h4>\
		</div>\
		<div class="modal-body ' + bdyCls + '">' + bdyMsg + '</div>';
	confirmed(msgTyp, msg, okFtn, cnclFtn, okBtnName, cancelBtnName);
	return false;
}


/**
  * getFocus(el, time) takes two arguments
  * el - element on which focus is to be taken [mandatory]
  * time - time in millisecond to get focus on element more time means slowly it takes user to element [optional] default is 1000 (1 second)
  */

function getFocus(el, time)
{
	time = time == undefined ? 1000 : time;
	if ($(el).offset() !== undefined) {
		$('html, body').animate({
			scrollTop: ($(el).offset().top - 100)
		}, time);
	}
}

function resetForm(block) {
	$(block).find(':input').each(function() {
		switch (this.type) {
			case 'password':
			case 'select-multiple':
			case 'select-one':
			case 'text':
			case 'textarea':
			case 'url':
				if($(this).attr('data-blank')!='not-blank') {
					$(this).val('');
				}
				
				break;
			case 'checkbox':
				$(this).prop('checked', false);
				$(this).prop('indeterminate', false);
				$("#err_"+$(this).attr('name')).html('');
				break;
			case 'radio':
				var name = $(this).attr('name');
				$("input:radio[name="+name+"]:first").trigger('click');
				$("#err_"+$(this).attr('name')).html('');
				break;
			case 'file':
				$(this).val('').attr('rel','');
				$("#fileLabel_"+$(this).attr('id')).html('');
				break;
		}
		$(block+' .'+defErrClass).removeClass(defErrClass);
		$("#err_"+$(this).attr('id')).html('');
		$(block+':first *:input[type!=hidden]:first').focus();
	});
	
	$(block+" select").each(function() {
		$(this).find('option:eq(0)').prop('selected', true).trigger("change").trigger('liszt:updated');;
	});
}

/**
* getFormArray(): This is a common Function for saving old data in form and later comparing for changes, returns a processed array
* selector + ' :input' - is container id (Required). Ex: #myInputFieldsContainer :input, .myUniqueClassToCheck :input, etc
* check - 1 for getting the differences between old data & current data.
* removeFromIndex - remove from index . 
**/

function getFormArray(selector, check, removeFromIndex) 
{ 
	// Set up an array to hold data
	var formArray = {};
	
	// Set up with a default value if the check's value is undefined.
	check = (check == undefined) ? 2 : check;
	
	// Set up with default value if removeFromIndex's value is undefined.
	removeFromIndex = (removeFromIndex == undefined) ? '' : removeFromIndex;
	
	// If elements are found in the given container, do this.
	if ($(selector+":not('.skipFrmArr')").length > 0)
	{
		// Iterating through all the elements in the given container that we don't need to skip.
		$(selector+":not('.skipFrmArr')").each(function()
		{
			// Set up value variable to hold value.
			var value = '';
			
			// If the input type is a checkbox, do this
			if ($(this).is(':checkbox'))
			{
				// If the input value is 'Y', do this
				if ($(this).val() == 'Y')
				{
					// Getting the value from related check-box.
					value = $(this).is(':checked') ? 'Y' : 'N';

				} else if ($(this).val() == 'y')
				{
					// Getting the value from related check-box.
					value = $(this).is(':checked') ? 'y' : 'n';

				} else if ($(this).val() == '1')
				{
					// Getting the value from the related check-box.
					value = $(this).is(':checked') ? '1' : '0';

				} else
				{
					// Getting the value from the related check-box.
					value = $(this).is(':checked') ? $(this).val() : '';

				}

			} else if ($(this).is(':radio'))
			{
				// If the radio button is checked, do this
				if ($(this).is(':checked')) 
				{
					// Getting the value from related radio.
					value = $(this).val();
				} 

			} else 
			{
				// If the value exists, do this
				if ($(this).val() != undefined || $(this).val() != null)
				{
					// Getting the value from a related input
					value = Array.isArray($(this).val()) ? $(this).val() : $(this).val().trim();
				}
			}
			
			// Checking if we only need to get the updated value; if check = 1, then set only 
			// the updated value in formArray, otherwise, set all values in formArray.
			if (check === 1)
			{
				// If the old value is not equal to the current value, do this.
				if ($(this).data('formValues') !== value && value != undefined)
				{
					// If input is radio
					if ($(this).is(':radio'))
					{
						// If radio is checked
						if ($(this).is(':checked'))
						{
							// If the radio's id is defined, do this.
							if ($(this).attr('id') != '' && $(this).attr('id') != undefined)
							{
								// Adding the value in formArray to send to calling function.
								formArray[$(this).attr('name').replace(removeFromIndex, '')] = value;
							}
						}	
					} else 
					{
						// If the input's id is defined, do this.
						if ($(this).attr('id') != '' && $(this).attr('id') != undefined)
						{
							// Adding the value in the formArray to send to the calling function.
							formArray[$(this).attr('id').replace(removeFromIndex, '')] = value;
						}
					}	
				}
			} else 
			{
				// Setting the value
				$(this).data('formValues', value);
				
				// If the input's id and value are defined, do this.
				if ($(this).attr('id') != undefined && value != undefined)
				{
					// If the input is radio . . .
					if ($(this).is(':radio'))
					{
						// If radio is checked . . .
						if ($(this).is(':checked'))
						{
							// If the radio's id is defined, do this.
							if ($(this).attr('id') != '' && $(this).attr('id') != undefined)
							{
								// Adding the value in formArray to send to the calling function.
								formArray[$(this).attr('name').replace(removeFromIndex, '')] = value;
							}
						}
					} else
					{
						// If the input's id is defined, do this.
						if ($(this).attr('id') != '' && $(this).attr('id') != undefined)
						{
							// Adding the value in formArray to send to the calling function.
							formArray[$(this).attr('id').replace(removeFromIndex, '')] = value;
						}
					}
				}
			}
		});
	}
	
	// Returning the container's value with id as index.
	return formArray;
}


/**
  * isValidUrl(eId, errBlk, errMsg)
  * This function takes its 2nd n 3rd as optional arguments
  * You should call this function to check if entered value is valid URL or not
  */

function isValidUrl(eId, errBlk, errMsg){
	
	var url = $.trim($('#' + eId).val()), 
		filter = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
	errMsg = (errMsg == undefined ? urlErrMsg : errMsg);
	errBlk = (errBlk == undefined ? '#err_' + eId : errBlk);
	
	if (url != '') {
		if (!filter.test(url)) {
			$('#' + eId).addClass(defErrClass);
			$(errBlk).html(errMsg);
			return false;
		} else {
			$('#' + eId).removeClass(defErrClass);
			$(errBlk).html(" ");
			return true;
		}
	} else {
		return true;
	}
}


/**
  * checkRadioBox(eId, errBlk, errMsg)
  * This function takes its 2nd n 3rd as optional arguments
  * You should call this function to check if entered value is valid URL or not
  */
  
function checkRadioBox(eName, errBlk, errMsg) {

	errMsg=(errMsg==undefined?radioErrMsg:errMsg);
	errBlk=(errBlk==undefined?'#err_'+eName:errBlk);
	
	if( !$("input[name="+eName+"]:checked").val() ) {
		$("input[name="+eName+"]").addClass(defErrClass);
		$(errBlk).html(errMsg);
		return false;
	} else {
		$("input[name="+eName+"]").removeClass(defErrClass);
		$(errBlk).html(" ");
		return true;
	}
	
}

// register jQuery extension
jQuery.extend(jQuery.expr[':'], {
    focusable: function (el, index, selector) {
        return $(el).is('a, textarea, select, button, :input, [tabindex]');
    }
});

$(document).on('keypress', '.entrAsTab input, .entrAsTab select, .entrAsTab textarea', function (event) {
    if (event.which == 13) {
		event.preventDefault();
        nextFld();
    }
});

function nextFld() {
	// Get all focusable elements on the page
	var canfocus = $(':focusable');
	var index = canfocus.index(document.activeElement) + 1;
	if (index >= canfocus.length) { 
		index = 0;
	}
	
	if (canfocus.eq(index).attr('tabindex') !== undefined && 
		canfocus.eq(index).attr('tabindex') == '-1'
	) {
		index++;
	}
	
	canfocus.eq(index).focus();
	canfocus.eq(index).select();
}

function prevFld() {
	// Get all focusable elements on the page
	var canfocus = $(':focusable');
	var index = canfocus.index(document.activeElement) - 1;
	if (index >= canfocus.length) { 
		index = 0;
	}
	
	if (canfocus.eq(index).attr('tabindex') !== undefined && 
		canfocus.eq(index).attr('tabindex') == '-1'
	) {
		index--;
	}
	
	canfocus.eq(index).focus();
	canfocus.eq(index).select();
}

function DisplayDialog(message) {
    BootstrapDialog.show({
        message: message,
        buttons: [
            {
                label: 'Close',
                action: function (dialogRef) {
                    dialogRef.close();
                    setTimeout(function () {
                        dialogRef.close();
                    }, 5000);
                }
            }]
    });
}


function strip_tags_all(e) {
    // cancel paste
    e.preventDefault();

    // get text representation of clipboard
    var text = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
	
	var tempDiv = document.createElement("DIV");

	tempDiv.innerHTML = text;

	var tempText = tempDiv.innerText;

    // insert text manually
    var result = document.execCommand("insertHTML", false, tempText);
    if ( !result )
    	document.execCommand('paste', false, content);
}

//function to strip unsupported html tags by craigslist while copy and paste in ad structure editor 
function strip_tags (input, allowed) { 
 
  // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')

  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi

  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
  });
}

// Function for formatting number with commas, dot separators
Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
		c = isNaN(c = Math.abs(c)) ? 2 : c, 
		d = d == undefined ? "." : d, 
		t = t == undefined ? "," : t, 
		s = n < 0 ? "-" : "", 
		i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
		j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

// Function for remove value from array after matching text.
function removeVal(arr) {
	var what, a = arguments, L = a.length, ax;
	while (L > 1 && arr.length) {
		what = a[--L];
		while ((ax= arr.indexOf(what)) !== -1) {
			arr.splice(ax, 1);
		}
	}
	return arr;
}