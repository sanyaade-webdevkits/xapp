$(document).ready(function(){

	//place #alerts near the bottom of the screen
	
	//siteRoot should be the authorizing server page
	siteRoot= "http://damien.xoxco.com/tester/auth_api";
	
	if(readCookie('pp_auth')){
		$('#login_li').hide();
		$('#join_li').hide();
	}else{
		$('#logout_li').hide();
	}
	
    $('#login_button').click(logByModal);
    $('#join_button').click(joinByModal);
});

////modal auth stuff
function logByModal(){

    var url= siteRoot+"/login";
    var data= $('#login_modal_form').serialize();

    $.post(url, data, function(json){
        if(json.status== 'success'){
            createCookie('pp_auth', json.auth, json.days);
            window.location.reload();
        }else{
           XAPP.alert(json.error, function(){ console.log(json.status);}, {"type": 'error'});
        }
    }, 'json');

    return false;
}

function joinByModal(){
    var url= siteRoot+"/join";
    var data= $('#join_modal_form').serialize();

    $.post(url, data, function(json){
        if(json.status== 'success'){
            createCookie('pp_auth', json.auth, json.days);
            window.location.reload();
        }else{
            alert(json.error);
        }
    }, 'json');
    return false;
}

function logoutByModal(){
    url= siteRoot+"/logout";

    $.post(url, function(json){
    	eraseCookie('pp_auth');
        window.location.reload();
    });
}

//cookie stuff
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
