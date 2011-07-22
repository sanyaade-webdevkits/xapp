XAPP.TEMPLATES = (function() { 

		var list_item = '<li data-id="${id}">${title}</li>';
		var list_item_image = '<li data-id="${id}"><aside><img src="${img}" /></aside>${title}</li>';
		
		var alert="<div id='alert_message' class='${type}'><p style=\"text-align: ${textAlign}\">${message}</p></div><div id='alert_background' class='${type}'></div>";
		
		var loading="<div id='alert_message' class='${type} ${template}'><br /><span style=\"text-align: ${textAlign}\">${message}</span><br /><img class='loading_icon' src='img/ajax-loader.png' height='35' width='35'></div><div id='alert_background' class='${type} ${template}'></div>";
		var extra_button="<a href='#' id='${id}' class='alert_button'>${label}</a>";				
		
		return {
			list_item: $.template(list_item),
			list_item_image: $.template(list_item_image),
			alert: $.template(alert),
			loading: $.template(loading),
			button: $.template(extra_button)
		}
		
})();
