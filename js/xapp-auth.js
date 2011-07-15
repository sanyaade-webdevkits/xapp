XAPP.AUTH = function() {

	var auth_cookie_name = 'pp_auth';
	var api_endpoint = '';
	
	return {	
		boot: function(endpoint) {
			api_endpoint = endpoint;
		},
	 	createCookie: function(name,value,days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		},
		readCookie: function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		eraseCookie: function(name) {
			createCookie(name,"",-1);
		},
		isAuthenticated: function() {
			if (this.readCookie(auth_cookie_name)) {
				return true;
			}
			return false;
		},
		login: function(success,fail) {
		
		    var data= $('form[action="#login"]').serialize();
			$.post(api_endpoint+'/login',data,function(json) {
				alert(json.status);
				if (json.status=='success') {
					$('div#application').addClass('loggedin');
					createCookie(auth_cookie_name,json.auth,json.days);
					
					if (success) {
						success(json);
					}
				} else {
					$('div#application').addClass('loggedout');
					XAPP.alert(json.error,null,{type:'error'});
					if (fail) {
						fail(json);
					}
				}
			});
			return false;
		},
		join: function(success,fail) {
		
		    var data= $('form[action="#join"]').serialize();
			$.post(api_endpoint+'/join',data,function(json) {
				if (json.status=='success') {
					$('div#application').addClass('loggedin');
					createCookie(auth_cookie_name,json.auth,json.days);
					if (success) {
						success(json);
					}
				} else {
					$('div#application').addClass('loggedout');
					XAPP.alert(json.error,null,{type:'error'});
					if (fail) {
						fail(json);
					}
				}
			});
			return false;
		},
		logout: function(callback) {
		
			$.post(api_endpoint+'/logout',function(json) {
				$('div#application').addClass('loggedout');
		    	eraseCookie(auth_cookie_name);
		    	if (callback) {
			    	callback();
			    }
			});
			return false;
		},
	}

}();



$(window).ready(function(){

	if (XAPP.AUTH.isAuthenticated()) {
		$('div#application').addClass('loggedin');
	} else {
		$('div#application').addClass('loggedout');
	}
});