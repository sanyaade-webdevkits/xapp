
var XAPP = (function() { 

			var transition; 

			var device_width = 320;			
			var min_height = 430;
			var max_height = 450;
			// holds a history of all the pages, in the order we viewed them, so we can go BACK
			var breadcrumbs = new Array();
			
			// holds a list of all the pages 
			var pages = new Array();
			var panes = new Array();
			
			// tells us which page we're on
			var current_page = 0;
			
			// holds a list of the tabs on the current page.
			var tabs = new Array();
			
			// Lawnchair localstorage db connector
			var LOCAL_STORAGE;
		
			return {
			
				scrollwatch: false,
				boot: function() { 
		
						LOCAL_STORAGE= new Lawnchair(function(){});
						
/*

						if ((navigator.platform.indexOf("iPad") != -1)) {
							device_width = 768;
							min_height = 1000;
							max_height = 1024;

						} else {
							device_width = 320;
							min_height = 430;
							max_height = 450;
						}
*/

						
						// add a header, footer, and alerts holder.
						$('div#application').prepend('<header></header><div id="alerts"></div>');
						$('div#application').append('<footer></footer>');
				
						// set everythign to be device width

						$('div#application').css('width',device_width+'px');
						$('div#application > #pages').css('width',device_width+'px');
						$(' div#application > #pages > #scroller > ul > li').css('width',device_width+'px');
						$('#alerts').css('width',device_width+'px');


	
						$('div#application > #pages > #scroller > ul').get(0).addEventListener( 'webkitTransitionEnd', function( event ) { XAPP.transition().finished(); }, false );

	
						// suck all the current pages into an array so we know where we are.
						count = 0;
						$('div#application > #pages > #scroller > ul > li').each(function() { 
												
							pages.push({title: $(this).attr('data-title'),offset: $(this).position().left,id: $(this).attr('id'),ipad:$(this).attr('data-ipad')});
							//$(this).css('position','relative');
							//$(this).css('float','none');
						});
							
						// show the first page
						$(' div#application > #pages > #scroller > ul > li:first-child').show();
						$(' div#application > #pages > #scroller > ul > li:first-child').css('position','absolute');

							
						// show the first tab of any multi-tab page
						$(' div#application > #pages > #scroller > ul > li > section').hide();
						$(' div#application > #pages > #scroller > ul > li > section:first-child').show();
					
						$('div#application > header > a.back').live('click',this.prevPage);
						$('div#application > header').click(function(e) {
							e.preventDefault();
							$('div#application > #pages > #scroller').touchScroll('setPosition', 0);			
						});
						
						// stop the entire app from being moved outside of the main window
						$('body').bind('touchmove',function(e) { 
							e.preventDefault(); 
						});
				
				
/*
						var preventDefaultScroll = function(event) {
							  event.preventDefault();
							  window.scroll(0,0);
							  return false;
						};
						document.addEventListener('touchmove', preventDefaultScroll, false);		
						
*/

/*
						$('input').focus(function() {
							var y = $(this).position().top;
							y -= 100;
							if (y < 0) { 
								y = 0;
							}
							window.scroll(0,0);							
							$('div#application > #pages > #scroller').touchScroll('setPosition',y);	
							return true;		
						});
*/

						$('input').focus(function() {
							if (XAPP.scrollwatch) {
								clearTimeout(XAPP.scrollwatch);
								XAPP.scrollwatch = null;
							}
						});


						$('input').blur(function() {
							// FIX THIS
							// It would be better if we were able to find  a way to detect when the
							// keyboard is hidden, instead of depending on the inputs blurring
							// but what this does is:
							// in 100 miliseconds, it will scroll the widnow back to the top
							// UNLESS another input is focused in the meantime.
							XAPP.scrollwatch = setTimeout(function() { window.scroll(0,0); },100);
						});

						
						$('div#application > footer > a').live('click',this.switchTab);
						
						// make sure accessory clicks do not fire the main row selection
						$(' div#application > #pages > #scroller > ul > li ul.list li a.accessory').live('click',function(e) {  e.preventDefault(); return false;});
						
						// handle iOS scrolling
						// may not be needed when iOS 5.0 comes out!
						$('div#application > #pages > #scroller').touchScroll();
				
						$(' div#application > #pages > #scroller > ul > li ul.list > li').live('click',function(e) {							
							// remove all active indicators
							e.preventDefault();

						//	$(' div#application > #pages > #scroller > ul > li ul.list > li').removeClass('active');
							
							if (!$(this).attr('nohandler')) { 
								$(this).addClass('active');
								if ($(this).attr('data-click')) { 
									var event = $(this).attr('data-click');
									eval(event);
								}
							}
						});

					
						this.updateToolbar();
					},		
				pages: function() {
					return pages;
				},
				title: function(newtitle) {
					$('div#application header h1').html(newtitle);
				},
				transition: function() {
					return transition;
				},
				isiPad: function(){
				    return (navigator.platform.indexOf("iPad") != -1);
				},
				isiPad: function(){
				   //Detect iPhone
			        (navigator.platform.indexOf("iPhone") != -1) ||
			        //Detect iPod
			        (navigator.platform.indexOf("iPod") != -1)
				},
				updateToolbar: function() {
					
						$('div#application header').html("<h1>"+pages[current_page].title + "</h1>");
						if (breadcrumbs.length > 0) {
							back_button_title = breadcrumbs[breadcrumbs.length-1].title;
							$('div#application > header').prepend('<a href="#" class="button back"><span>' + back_button_title + '</span></a>');		
						}
						
						
						var id = '#'+pages[current_page].id;

						if ($(id).attr('data-button')) { 
							$('div#application > header').append('<a href="#" class="button next">' + $(id).attr('data-button') + '</a>');
							$('div#application > header .button.next').unbind();
							$('div#application > header .button.next').bind('click',function(){ eval($(id).attr('data-click')); });
						}

						if ($('div#application > header').hasClass('loading')) {
							if (!$('div#application > header > #toolbar_loader').length) {
								$('div#application > header').prepend('<div id="toolbar_loader"><img src="img/loading_small_white.png" border="0" height="16" width="16" class="loading_indicator"></div>');
							}
						}
/*
						$('div#application > #pages').touchScroll({scrollHeight:$(id).outerHeight(true)});
						$('div#application > #pages').touchScroll('update');
						$('div#application > #pages').touchScroll('setPosition', 0);
*/
			


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
						$(' div#application > #pages > #scroller > ul > li ul.list > li').removeClass('active');
						XAPP.pageResizer(id);

				
				},
			online: function() {
				return navigator.onLine;
			},
			localStorage: function() { return LOCAL_STORAGE; },
            localGet: function(query,callback) {
                LOCAL_STORAGE.get(query,callback);
            },
            localSave: function(obj,callback) {
                LOCAL_STORAGE.save(obj,callback);
            },
			startLoading: function() {
				$('div#application > header').addClass('loading');
			},
			stopLoading: function() {
				$('div#application > header').removeClass('loading');
				$('div#application > header .loading_indicator').remove();
			},
				/*
					localStorage: if true it will try localStorage first, and then store the data when returned from the server
					url: the url of the api
					data: arguments sent to the api
					success: function to be called once data is retrieved
					failure: function to be called if the success fails
					dataType: json or xml
				*/
			ajax: function(request){

				// set up a query signature we can use to cache data.
				var query_signature = request.url+request.data;

				var callback_counter = 0;

				XAPP.startLoading();

				// check local storage for a cached version,
				// call success() on any stored data
				LOCAL_STORAGE.get(query_signature,function(results) { if (results)  { request.success(results.data,++callback_counter);  } });
				
				if (this.online()) {
					// Proceed to making the ajax call..
					$.ajax({
						url: request.url,
						data: request.data,
						dataType: request.dataType,
						timeout: 10000, // timeout after 10 seconds
						success: function(json){
									XAPP.stopLoading();
									var saveThis= { key: query_signature,
										   		    data: json
										   		   };
									LOCAL_STORAGE.save(saveThis);
									//call success on new results
									request.success(json,++callback_counter);
								},
						error: function(xhr,status,error){
							XAPP.stopLoading();
							if (!XAPP.online()) {
								status ='offline';
								error = 'You are not connected to the internet';
							}
							request.error(status,error);
						
						}
					});
				} else {
					XAPP.stopLoading();
					XAPP.alert('You are not connected to the internet, so information displayed may be slightly out of date.');
				}
			},
		 	switchTab: function() {
				// switch to which tab?
				var tab = $(this).attr('data-tab');

				var id = '#'+pages[current_page].id;

				// deactivate other tabs
				$('div#application > footer > a').removeClass('active');
				$(id + ' > section').hide();

				$('div#application > #pages > #scroller').touchScroll('setPosition', 0);
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
		 		height = $(id).outerHeight(true);
		 		if (height > min_height) {
		 			height += 20;
		 		}
		 		if (height < max_height) {
		 			height = max_height;
		 		}
 				$('div#application > #pages > #scroller').touchScroll({scrollHeight:height});
				$('div#application > #pages > #scroller').touchScroll('update');
				$('div#application > #pages > #scroller').touchScroll('setPosition', 0);

		 },		
		 nextPage: function(callback) {			
			breadcrumbs.push({title:  pages[current_page].title, index: current_page, offset: pages[current_page].offset});
			
			XAPP.navigateToPage(current_page+1,callback);
			
			return false;
		},
		prevPage: function(e,callback) {
			e.preventDefault();
			var prev_page = breadcrumbs.pop();
			$('div#application > header > a.back').blur();
			XAPP.navigateToPage(prev_page.index,callback);
			return false;
		},
		gotoPage: function(x,callback,options) {
		
			options = $.extend({reset_history: false,no_history:false},options);
			
			if (isNaN(x)) {
				for (var p in pages) {
					if (pages[p].id==x) {
						x = p;
					}
				}	
			}
			if (isNaN(x)) {
				XAPP.alert('Application Error: Cannot find page ' + x);
				return false;
			}
			
			
			if (x == current_page) {
				XAPP.updateToolbar();
				if (typeof(callback)=='function') {
					callback();
				}		
				return false;
			}
			if (options.reset_history) { 
                breadcrumbs = new Array();
                current_page = 0;
			}
			if (!options.no_history) {
				breadcrumbs.push({title:  pages[current_page].title, index: current_page, offset: pages[current_page].offset});
			}

			XAPP.navigateToPage(x,callback);
			return false;
		},
		navigateToPage: function(x,callback) {

			// remove the selection highlight.  it is distracting!

        
			var new_offset = pages[x].offset - pages[current_page].offset;

			
/*
			if (pages[x].ipad=='full') {

				for (var p in pages) {
					if (p != x && p != current_page) {
						alert('hiding page ' + p);
						$(' div#application > #pages > #scroller > ul li#' + pages[p].id).hide();
					} else {
						alert('showing page ' + p);
						$(' div#application > #pages > #scroller > ul li#' + pages[p].id).css('float','none');
						$(' div#application > #pages > #scroller > ul li#' + pages[p].id).css('position','absolute');
						$(' div#application > #pages > #scroller > ul li#' + pages[p].id).css('top','0px');
						$(' div#application > #pages > #scroller > ul li#' + pages[p].id).show();					
					}
				}
				
				alert('SEtting page ' + x + ' to 320px left');
				$('div#application > #pages > #scroller > ul li#' + pages[x].id).css('left',"320px");
				$('div#application > #pages > #scroller > ul li#' + pages[x].id).css('width',"448px");

				$('div#application > #pages > #scroller > ul li#' + pages[0].id).css('left',"0px");
				$('div#application > #pages > #scroller > ul').css('left','0px');
				current_page = x;
				XAPP.updateToolbar();
				if (typeof(callback)=='function') {
					callback();
				}

			} else {

*/

				
				// hide all the unnecessary pages.
				for (var p in pages) {
					if (p != x && p != current_page) {
						$(' div#application > #pages > #scroller > ul li#' + pages[p].id).hide();
						$(' div#application > #pages > #scroller > ul li#' + pages[p].id).css('left',640);
					} else {
						$(' div#application > #pages > #scroller > ul li#' + pages[p].id).css('float','none');
						$(' div#application > #pages > #scroller > ul li#' + pages[p].id).css('position','absolute');
						$(' div#application > #pages > #scroller > ul li#' + pages[p].id).css('top',0);
						$(' div#application > #pages > #scroller > ul li#' + pages[p].id).show();
					}
				}
			
				if (new_offset > 0) {
					direction = 'l';
					
					// put the current page on the right hand side
	/*
					$(' div#application > #pages > #scroller > ul li#'+pages[current_page].id).css('left',0);
					$(' div#application > #pages > #scroller > ul').css('left',0);
					$(' div#application > #pages > #scroller > ul li#'+pages[x].id).css('left',320);
	*/
					var cur_offset =  $(' div#application > #pages > #scroller > ul li#'+pages[current_page].id).css('left');
					if (cur_offset == 'auto') {
						cur_offset = 0;
					} else {
						cur_offset = parseInt(cur_offset);
					}
					new_offset = cur_offset + device_width;
					$(' div#application > #pages > #scroller > ul li#'+pages[x].id).css('left',new_offset+'px');
					new_offset = 0 - new_offset;			
	
				} else {
					direction = 'r';
	
					var cur_offset =  $(' div#application > #pages > #scroller > ul li#'+pages[current_page].id).css('left');
					if (cur_offset == 'auto') {
						cur_offset = 0;
					} else {
						cur_offset = parseInt(cur_offset);
					}				
	
					new_offset = cur_offset - device_width;
					$(' div#application > #pages > #scroller > ul li#'+pages[x].id).css('left',new_offset+'px');
					new_offset = 0 - new_offset;			
	
	//				new_offset = 0;
	
	
	            
				}
		
				transition = (function(new_offset,callback) {
	
					return {
						go: function() { 
							$('div#application > #pages > #scroller > ul > li ul.list > li').removeClass('active');
	
							$(' div#application > #pages > #scroller > ul').animate({
								left: new_offset,
	                          },300,'swing',function() {
								XAPP.transition().finished();
							});					
						},
						finished: function() {
							current_page = x;
							XAPP.updateToolbar();
							if (typeof(callback)=='function') {
								callback();
							}
						}
					
					}
					
				})(new_offset,callback);
				
				if ($(' div#application > #pages > #scroller > ul > li ul.list > li.active').length) {
					setTimeout('XAPP.transition().go();',200);
				} else {
					transition.go();
				}
/* 			} */
	            
/*
			$(' div#application > #pages > #scroller > ul').animate({
				left: new_offset,
			},300,'swing',function() {
				current_page = x;
				XAPP.updateToolbar();
				if (typeof(callback)=='function') {
					callback();
				}

			});
*/



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
			
			if(options.template== 'loading' || options.template=='confirmation'){
				$('#alerts, #alert_message').css('bottom', 140 );
				
				$('#alert_background, #alert_message').height(200);

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