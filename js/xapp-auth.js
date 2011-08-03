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
			this.createCookie(name,"",-1);
		},
		isAuthenticated: function() {
			if (this.readCookie(auth_cookie_name)) {
				return true;
			}
			return false;
		},
		login: function(success,fail) {
		
		    var data= $('form[action="#login"]').serialize();
			$.ajax(
				{
					url:api_endpoint+'/login',
					data: data,
					dataType: 'json',
					type: 'post',
					success: function(json) {
								if (json.status=='success') {
									$('div#application').removeClass('loggedout');
									$('div#application').addClass('loggedin');
									XAPP.AUTH.createCookie(auth_cookie_name,json.auth,json.days);
									
									if (success) {
										success(json);
									}
								} else {
									$('div#application').addClass('loggedout');
									$('div#application').removeClass('loggedin');
									XAPP.alert(json.error,null,{type:'error'});
									if (fail) {
										fail(json);
									}
								}
						},
					error: function(xhr,status,error) {
					
						if (fail) {
							fail({status: 'error',error:error});
						} else {
							XAPP.alert(error);
						}
					}
			});
			return false;
		},
		join: function(success,fail) {
		
		    var data= $('form[action="#join"]').serialize();
			$.ajax({
				url: api_endpoint+'/join',
				data: data,
				dataType: 'json',
				type: 'post',
				success: function(json) {
					if (json.status=='success') {
						$('div#application').removeClass('loggedout');
						$('div#application').addClass('loggedin');
						XAPP.AUTH.createCookie(auth_cookie_name,json.auth,json.days);
						if (success) {
							success(json);
						}
					} else {
						$('div#application').addClass('loggedout');
						$('div#application').removeClass('loggedin');
						XAPP.alert(json.error,null,{type:'error'});
						if (fail) {
							fail(json);
						}
					}
				},
				error: function(xhr,status,error) {
				
					if (fail) {
						fail({status: 'error',error:error});
					} else {
						XAPP.alert(error);
					}
				}
			});
			return false;
		},
		logout: function(callback) {
		
			$.ajax({
				url: api_endpoint+'/logout',
				dataType: 'json',
				success: function(json) {
					$('div#application').addClass('loggedout');
					$('div#application').removeClass('loggedin');

			    	XAPP.AUTH.eraseCookie(auth_cookie_name);
			    	if (callback) {
				    	callback();
				    }
			    },
				error: function(xhr,status,error) {
				
					if (fail) {
						fail({status: 'error',error:error});
					} else {
						XAPP.alert(error);
					}
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