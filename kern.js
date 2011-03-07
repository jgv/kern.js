/*
* Kern.JS 0.1

* Copyright 2011, Brendan Stromberger, www.brendanstromberger.com
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/

* Thanks to the Lettering.JS team for their amazing plugin and making the web a better place.
* Date: Monday, March 7 2011
*/

if (typeof jQuery === 'undefined') {
	var includejquery = document.createElement("script");
	includejquery.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js";
	document.body.appendChild(includejquery);
	includejquery.onload = kern;
}
else {
	kern();
}

function kern() {
	var activeEl, unit, increment, kerning, adjustments, thePanel, activeHeader;
	kerning = 0;
	adjustments = {};
	var lastX;
	thePanel =
		['<style>',
			'.kernjs_panel * { outline: none }',
			'.kernjs_panel { position: absolute; top: 0; z-index: 1000000000; text-align: center; height: 40px; width: 100%; margin: 0 auto; background: -moz-linear-gradient(top, #45484d 0%, #000000 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#45484d), color-stop(100%,#000000)); border-bottom: 1px solid #333;}',
			'.kernjs_panel .kernjs_button { padding-top: 20px; }',
			'.kernjs_button .btn { display: inline-block; -webkit-border-radius: 8px; -moz-border-radius: 8px; border-radius: 8px; -webkit-box-shadow: 0 8px 0 #abad4f, 0 15px 20px rgba(0,0,0,.2); -moz-box-shadow: 0 8px 0 #abad4f, 0 15px 20px rgba(0,0,0,.2); box-shadow: 0 8px 0 #abad4f, 0 15px 20px rgba(0,0,0,.); -webkit-transition: -webkit-box-shadow .1s ease-in-out; -moz-transition: -moz-box-shadow .1s ease-in-out; -o-transition: -o-box-shadow .1s ease-in-out; transition: box-shadow .1s ease-in-out; }',
			'.kernjs_button .btn span { display: inline-block; padding: 9px 20px; text-shadow: 0 -1px 1px rgba(255,255,255,.8); background: #e5e696; background: -moz-linear-gradient(top, #e5e696 0%, #d1d360 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#e5e696), color-stop(100%,#d1d360)); -webkit-border-radius: 8px; -moz-border-radius: 8px; border-radius: 8px; -webkit-box-shadow: inset 0 -1px 1px rgba(255,255,255,.15); -moz-box-shadow: inset 0 -1px 1px rgba(255,255,255,.15); box-shadow: inset 0 -1px 1px rgba(255,255,255,.15); -webkit-transition: -webkit-transform .2s ease-in-out; -moz-transition: -moz-transform .2s ease-in-out; -o-transition: -o-transform .2s ease-in-out; transition: transform .2s ease-in-out; }',
			'.kernjs_button .btn:active { -webkit-box-shadow: 0 8px 0 #abad4f, 0 12px 10px rgba(0,0,0,.2); -moz-box-shadow: 0 8px 0 #abad4f, 0 12px 10px rgba(0,0,0,.2); box-shadow: 0 8px 0 #abad4f, 0 12px 10px rgba(0,0,0,.2); }',
			'.kernjs_button .btn:active span { -webkit-transform: translate(0, 4px); -moz-transform: translate(0, 4px); -o-transform: translate(0, 4px); transform: translate(0, 4px); }',
			'.kernjs_button .btn span { color: #40411e; font-family: "Georgia"; font-weight: 600; font-style: italic; font-size: 14px; }',
			'.kernjs_button a { text-decoration: none; }',
			'h1, h2, h3, h4, h5, h6 { cursor: pointer; }',
		'</style>',
		'<div class="kernjs_panel">',
			'<div class="kernjs_button">',
				'<a class="btn" href="#" class="kernjs_finish"><span>Finish Editing</span></a>',
			'</div>',
		'</div>'
	].join('\n');

	jQuery(document.body).prepend(thePanel);
	
	jQuery("h1, h2, h3, h4, h5, h6").click(function(event) { // Activate a word
		if(!(activeHeader === this))
		{
			activeHeader = this;
			console.log(activeHeader);
			var el = findRootHeader(event.target);
			console.log(el);
			var previousColor = 0;
			var theHtml = splitter(jQuery(el)); // Call method from Lettering.js. This method splits up the clicked body of text into <span> elements containing single letters.
			console.log($(theHtml));
//			var theHtmlString = jQuery(theHtml).parent().parent().html();
//			console.log(jQuery(theHtml).parent().parent().html());
			jQuery(this).attr('unselectable', 'on').css('-moz-user-select', 'none').each(function() { this.onselectstart = function() { return false; }; } );
			jQuery(el).children().css('opacity', '.5');
			jQuery(this).mousedown(function(event) { // Listens for clicks on the newly created span objects.
				if(previousColor!==0) { jQuery(activeEl).css('color', previousColor).css('opacity', .5); }
				activeEl = event.target; // Set activeEl to represent the clicked letter.
				previousColor = jQuery(activeEl).css('color');
				jQuery(activeEl).css('color', '#ff7200').css('opacity', 1);
				lastX = event.pageX;
				if(typeof(adjustments[jQuery(activeEl).attr("class")]) === 'undefined')
				{
					adjustments[jQuery(activeEl).attr("class")] = 0;
				}
				kerning = adjustments[jQuery(activeEl).attr("class")];
				function MoveHandler(event){
					var moveX = event.pageX - lastX;
					if(moveX !== 0)
					{
						lastX = event.pageX;
						kerning += moveX;
						adjustments[jQuery(activeEl).attr("class")] = kerning;
						jQuery(activeEl).css('margin-left', kerning);
						generateCSS(adjustments, unit, increment);
					}
				}
				jQuery(this).bind('mousemove', MoveHandler);
				jQuery(this).mouseup(function(event){
					jQuery(this).unbind('mousemove', MoveHandler);
				});
			}); // end el click
		}
	});

	jQuery(document).keydown(function(event) {
		if(activeEl) {
			if(adjustments[jQuery(activeEl).attr("class")]) { // If there are current adjustments already made for this letter
				kerning = adjustments[jQuery(activeEl).attr("class")]; // Set the kerning variable to the previously made adjustments for this letter (stored inside the adjustments dictionary object)
			}
			if(event.which === 37) { // If left arrow key
				kerning--;
				jQuery(activeEl).css('margin-left', kerning);
				adjustments[jQuery(activeEl).attr("class")] = kerning; // add/modify the current letter's kerning information to the "adjustments" object.
				generateCSS(adjustments, unit, increment);
			}
			if(event.which === 39) { // If right arrow key
				kerning++;
				jQuery(activeEl).css('margin-left', kerning);
				adjustments[jQuery(activeEl).attr("class")] = kerning; // add/modify the current letter's kerning information to the "adjustments" object.
				generateCSS(adjustments, unit, increment);
			}
		}
	});
	
	var outputPanel = jQuery(".kernjs_panel a").mouseup(function() {
		var outputPanel = [
			'<style>',
				'.kernjs_overlay { position: absolute; top: 0; height: 100%; width: 100%; z-index: 100000000000000; overflow: none; background: rgba(0,0,0,.8); opacity: 0; font-family: Georgia; color: #222; }',
				'.kernjs_container { background: #EEE; margin: 0 auto; width: 570px; -webkit-border-radius: 0 0 5px 5px; border-radius: 0 0 5px 5px; }',
				'.kernjs_instructions { margin: 0 auto; text-align: center; padding: 40px; }',
				'.kernjs_p { font-size: 18px; line-height: 24px; color: #555; text-align: left; text-shadow: 0 -1px 1px rgba(255,255,255,.8) }',
				'.kernjs_instructions a { color: #009bd5 !important; text-align: center !important }',
				'.kernjs_instructions a:visited { color: #009bd5 !important }',
				'.kernjs_instructions textarea { width: 100% !important; height: 180px !important; -moz-border-radius: 0px !important; -webkit-border-radius: 0px !important; border-radius: 5px !important; border-color: #BBB !important; }',
				'.kernjs_note { font-size: 13px; text-align: center; }',
				'.kernjs_style { font-style: italic; }',
				'.kernjs_button { list-style-type: none; }',
				'.kernjs_finish { padding: 15px 0 20px 0; text-align: center; }',
				'.kernjs_contact { text-align: center; font-size: 14px; }',
			'</style>',
			
			'<div class="kernjs_overlay">',
				'<div class="kernjs_container">',
					'<div class="kernjs_instructions">',
						'<div class="kernjs_p">Looks awesome. Here\'s the CSS for your lovely letters. Paste the following CSS into a stylesheet and include it in your page, then use the wonderfully easy-to-use <a class="kernjs_style" href="http://www.letteringjs.com\">Lettering.JS</a> to create the necessary style hooks.</p><br/>',
						'<textarea>',
							generateCSS(adjustments),
						'</textarea>',
						'<div class="kernjs_button kernjs_finish">',
							'<li><a class="btn" href="#"><span class="kernjs_continue">Continue Editing</span></a></li>',
						'</div>',
						'<div class="kernjs_contact">Please email <a class="kernjs_style" href="mailto:contact@kernjs.com">contact@kernjs.com</a> if you have any trouble</div></div>',
					'</div>',
				'</div',
			'</div>'
		].join('\n');
		jQuery(document.body).prepend(outputPanel);
		jQuery(".kernjs_overlay").animate({ "opacity": 1 }, function() {
			// callback function here if we want to add any animations for the overlayed content later
		});
		
		jQuery(".kernjs_continue").click(function() {
			$(".kernjs_overlay").fadeOut(function() {
				$(this).detach();
			});
		});
	});
}

function generateCSS(adjustments) {
	var x, concatCSS, theCSS;
	theCSS = [];
	for(x in adjustments) {
		if(adjustments.hasOwnProperty(x)) {
			concatCSS = [
				"." + x + " {",
				'\t' + 'margin-left: ' + adjustments[x] + 'px;',
				'}'
				].join('\n');
				theCSS = theCSS + '\n' + concatCSS;
		}
	}
	return theCSS;
}

function findRootHeader(el){
	var toReturn;
	toReturn = el;
	while(jQuery.inArray(jQuery(toReturn).get(0).tagName, ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']) < 0)
	{
		toReturn = jQuery(toReturn).parent();
	}
	return toReturn;
}

function splitter(el) {
	if(jQuery(el).children().length === 0)
	{
		return injector(jQuery(el), '', 'char', '');
	}
	return jQuery.each(el.children(), function(index, value){
		splitter(value);
	});
}

function injector(t, splitter, klass, after) {
	var a = t.text().split(splitter), inject = '';
	if (a.length > 1) {
		jQuery(a).each(function(i, item) {
			inject += '<span class="'+klass+(i+1)+'">'+item+'</span>'+after;
		});	
		t.empty().append(inject);
	}
}