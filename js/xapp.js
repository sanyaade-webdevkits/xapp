var XAPP = (function() { 

			// holds a history of all the pages, in the order we viewed them, so we can go BACK
			var breadcrumbs = new Array();
			
			// holds a list of all the pages 
			var pages = new Array();
			
			// tells us which page we're on
			var current_page = 0;
			
			// holds a list of the tabs on the current page.
			var tabs = new Array();
		
			return {
				boot: function() { 
				
						// add a header, footer, and alerts holder.
						$('div#application').prepend('<header></header><div id="alerts"></div>');
						$('div#application').append('<footer></footer>');
				
						// suck all the current pages into an array so we know where we are.
						$('div#application > #pages >  ul > li').each(function() { 
							pages.push({title: $(this).attr('data-title'),offset: $(this).position().left,id: $(this).attr('id')});
						});
							
						// show the first page
						$('div#application > #pages > ul > li:first-child').show();
							
						// show the first tab of any multi-tab page
						$('div#application > #pages > ul > li > section').hide();
						$('div#application > #pages > ul > li > section:first-child').show();
					
						$('div#application > header > a.back').live('click',this.prevPage);
						$('div#application > header').click(function(e) {
							e.preventDefault();
							$('div#application > #pages > ul').touchScroll('setPosition', 0);			
						});
				
						$('div#application > footer > a').live('click',this.switchTab);
						
						// handle iOS scrolling
						// may not be needed when iOS 5.0 comes out!
						$('div#application > #pages > ul').touchScroll();
				
						$('div#application > #pages > ul > li ul.list > li').live('click',function() {
							
						// remove all active indicators
						$('div#application > #pages > ul > li ul.list > li').removeClass('active');
						
							$(this).addClass('active');
							if ($(this).attr('data-click')) { 
								var event = $(this).attr('data-click');
								eval(event);
							}
						});
					
						this.updateToolbar();
					},		
				title: function(newtitle) {
					$('div#application header h1').html(newtitle);
				},
				updateToolbar: function() {
					
						$('div#application header').html("<h1>"+pages[current_page].title + "</h1>");
						if (breadcrumbs.length > 0) {
							back_button_title = breadcrumbs[breadcrumbs.length-1].title;
							$('div#application > header').prepend('<a href="#" class="button back">' + back_button_title + '</a>');		
						}
						
						
						var id = '#'+pages[current_page].id;

						if ($(id).attr('data-button')) { 
							$('div#application > header').append('<a href="#" class="button next">' + $(id).attr('data-button') + '</a>');
							$('div#application > header .button.next').unbind();
							$('div#application > header .button.next').bind('click',function(){ eval($(id).attr('data-click')); });
						}

						$('div#application > #pages > ul').touchScroll({scrollHeight:$(id).outerHeight(true)});
						$('div#application > #pages > ul').touchScroll('update');
						$('div#application > #pages > ul').touchScroll('setPosition', 0);
			


						$('div#application > footer').hide();
						$('div#application > footer').html('');
						var id = '#'+pages[current_page].id;
						
						tabs = new Array();
			
						// suck all the tabs into an array 
						$(id + ' > section').each(function() {
							tabs.push({tab: $(this).attr('data-tab'),title: $(this).attr('data-title'),id: $(this).attr('id')});
							$(this).hide();
							$('div#application > footer').append('<a href="#" data-tab="' + $(this).attr('id') + '"><strong>' + $(this).attr('data-tab') + '</strong></a>');
						});
			
						// show the first tab.
						$(id + ' > section').hide();
						$(id+ ' > section:first-child').show();
						$('div#application > footer > a:first-child').addClass('active');
			
						if (tabs.length > 0) {
							if (tabs[0].title!='') { 
								XAPP.title(tabs[0].title);
							}
							$('div#application > footer').show();
						}
						$('div#application > #pages > ul > li ul.list > li').removeClass('active');
		
				
				},
	
		 	switchTab: function() {
				// switch to which tab?
				var tab = $(this).attr('data-tab');

				var id = '#'+pages[current_page].id;

				// deactivate other tabs
				$('div#application > footer > a').removeClass('active');
				$(id + ' > section').hide();

				$('div#application > #pages > ul').touchScroll('setPosition', 0);
				if ($('#'+tab).attr('data-before')) {
					var event = $('#'+tab).attr('data-before');
					res = eval(event);			
				}

				// activate this tab
				$('#' + tab).show();
				$(this).addClass('active');

				if ($('#'+tab).attr('data-after')) {
					var event = $('#'+tab).attr('data-after');
					res = eval(event);			
				}
				
				if ($('#'+tab).attr('data-title')) { 
					XAPP.title($('#'+tab).attr('data-title'));
				}
				XAPP.pageResizer(id);	
			},
		 pageResizer: function(id) {		 
 				$('div#application > #pages > ul').touchScroll({scrollHeight:$(id).outerHeight(true)});
				$('div#application > #pages > ul').touchScroll('update');
				$('div#application > #pages > ul').touchScroll('setPosition', 0);

		 },		
		 nextPage: function(callback) {			
			breadcrumbs.push({title:  pages[current_page].title, index: current_page, offset: pages[current_page].offset});
			
			var next_id = pages[current_page+1].id;
						
			$('div#application > #pages > ul').animate({
				left: '-=320',
			},'fast',function() {
				current_page++;
				XAPP.updateToolbar();
				if (typeof(callback)=='function') {
					callback();
				}

			});
			
			return false;
		},
		prevPage: function(callback) {
			var prev_page = breadcrumbs.pop();
			
			var new_offset = prev_page.offset;
			$('div#application > #pages >  ul').animate({
				left: -new_offset,
			},'fast',function() {
				current_page=prev_page.index;
				XAPP.updateToolbar();
				if (typeof(callback)=='function') {
					callback();
				}
			});
			return false;
		},
		gotoPage: function(x,callback,no_history) {
			if (!no_history) {
				breadcrumbs.push({title:  pages[current_page].title, index: current_page, offset: pages[current_page].offset});
			}
			var new_offset = pages[x].offset;
			$('div#application > #pages > ul').animate({
				left: -new_offset,
			},'fast',function() {
				current_page = x;
				XAPP.updateToolbar();
				if (typeof(callback)=='function') {
					callback();
				}

			});
			return false;
		},
		//options is an optional obj with a field type 'error'
		//buttons is an optional array of jsons of the following structure:
		// {"label": "buttonLabel", "href": "#buttonhref", "onclick": "someFunction();"}

		alert: function(msg, callback, options){
			
			var options = jQuery.extend({
				template: 'alert',
				message:msg,
				type:'alert',
				buttonList: [{
					label: 'OK',
					onclick: function() { XAPP.resetAlert(); },
				}],
				textAlign: 'center',
			},options);
			
			if($('#alerts').html()){
				XAPP.resetAlert();	
			}

			$('#alerts').append(XAPP.TEMPLATES[options.template], options);
			
			if(options.template== 'loading'){
				$('#alerts, #alert_message').css('bottom', window.innerHeight/2.5 );
				$('#alert_background, #alert_message').height(window.innerHeight/3);
			}else{
				$('#alert_background, #alert_message').height(window.innerHeight/2);
			
				if(options.buttonList){
					$('#alert_message').append("<div class='clearer'></div>");
					for(var i in options.buttonList){
						options.buttonList[i].id = i + '_alert_button';
						$('#alert_message').append(XAPP.TEMPLATES.button, options.buttonList[i]);	
						if (options.buttonList[i].onclick) {
							$('#'+i+'_alert_button').bind('click',options.buttonList[i].onclick);
						}
					}
				}			
			}
			$('#alerts').show();	
					
		},
		//reset alert
		resetAlert: function(){
		
			$('#alerts').html('');
			$('#alerts, #alert_message').css('bottom', 0);
			return false;
		}
	}
	
			
})();