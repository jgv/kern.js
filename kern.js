if (typeof jQuery === 'undefined') {
	var includejquery = document.createElement("script");
	includejquery.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js";
	// var html_doc = document.getElementsByTagName('head').item(0);
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
			'#kernjs_panel { text-align: center; height: 40px; width: 100%; margin: 0 auto; background: -moz-linear-gradient(top, #45484d 0%, #000000 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#45484d), color-stop(100%,#000000)); border: 1px solid #EAEAEA; font-family: \'Lucida Grande\', \'Helvetica Neue\', Helvetica, arial; }',
			'#kernjs_panel ul { list-style-type: none; display: inline-block; padding-top: 3px; }',
			'#kernjs_panel .btn { display: inline-block; -webkit-border-radius: 8px; -moz-border-radius: 8px; border-radius: 8px; -webkit-box-shadow: 0 8px 0 #abad4f, 0 15px 20px rgba(0,0,0,.2); -moz-box-shadow: 0 8px 0 #abad4f, 0 15px 20px rgba(0,0,0,.2); box-shadow: 0 8px 0 #abad4f, 0 15px 20px rgba(0,0,0,.); -webkit-transition: -webkit-box-shadow .1s ease-in-out; -moz-transition: -moz-box-shadow .1s ease-in-out; -o-transition: -o-box-shadow .1s ease-in-out; transition: box-shadow .1s ease-in-out; }',
			'#kernjs_panel .btn span { display: inline-block; padding: 10px 20px; font-family: Helvetica, Arial, sans-serif; line-height: 1; text-shadow: 0 -1px 1px rgba(255,255,255,.8); background: #e5e696; background: -moz-linear-gradient(top, #e5e696 0%, #d1d360 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#e5e696), color-stop(100%,#d1d360)); -webkit-border-radius: 8px; -moz-border-radius: 8px; border-radius: 8px; -webkit-box-shadow: inset 0 -1px 1px rgba(255,255,255,.15); -moz-box-shadow: inset 0 -1px 1px rgba(255,255,255,.15); box-shadow: inset 0 -1px 1px rgba(255,255,255,.15); -webkit-transition: -webkit-transform .2s ease-in-out; -moz-transition: -moz-transform .2s ease-in-out; -o-transition: -o-transform .2s ease-in-out; transition: transform .2s ease-in-out; }',
			'#kernjs_panel .btn:active { -webkit-box-shadow: 0 8px 0 #abad4f, 0 12px 10px rgba(0,0,0,.2); -moz-box-shadow: 0 8px 0 #abad4f, 0 12px 10px rgba(0,0,0,.2); box-shadow: 0 8px 0 #abad4f, 0 12px 10px rgba(0,0,0,.2); }',
			'#kernjs_panel .btn:active span { -webkit-transform: translate(0, 4px); -moz-transform: translate(0, 4px); -o-transform: translate(0, 4px); transform: translate(0, 4px); }',
			'#kernjs_panel a { color: #40411e; }',
		'</style>',
		'<div id="kernjs_panel">',
		'<ul>',
			'<li><a class="btn" href="#" id="kernjs_finish"><span>Finish Editing</span></a></li>',
		'</div>'
	].join('\n');

	jQuery(document.body).prepend(thePanel);
	
	jQuery("h1, h2, h3, h4, h5, h6").click(function(event) { // Activate a word
		if(!(activeHeader === this))
		{
			activeHeader = this;
			var el = findRootHeader(event.target);
			var previousColor = 0;
			jQuery(this).attr('unselectable', 'on').css('-moz-user-select', 'none').each(function() { this.onselectstart = function() { return false; }; } );
			splitter(jQuery(el)); // Call method from Lettering.js. This method splits up the clicked body of text into <span> elements containing single letters.
			jQuery(el).children().css('opacity', '.5');
			jQuery(this).mousedown(function(event) { // Listens for clicks on the newly created span objects.
				if(previousColor!==0) { jQuery(activeEl).css('color', previousColor); }
				activeEl = event.target; // Set activeEl to represent the clicked letter.
				previousColor = jQuery(activeEl).css('color');
				jQuery(activeEl).css('color', 'red');
				lastX = event.pageX;
				if(typeof(adjustments[jQuery(activeEl).attr("id")]) === 'undefined')
				{
					adjustments[jQuery(activeEl).attr("id")] = 0;
				}
				kerning = adjustments[jQuery(activeEl).attr("id")];
				function MoveHandler(event){
					var moveX = event.pageX - lastX;
					if(moveX != 0)
					{
						lastX = event.pageX;
						kerning +=moveX;
						adjustments[jQuery(activeEl).attr("id")] = kerning;
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
			if(adjustments[jQuery(activeEl).attr("id")]) { // If there are current adjustments already made for this letter
				kerning = adjustments[jQuery(activeEl).attr("id")]; // Set the kerning variable to the previously made adjustments for this letter (stored inside the adjustments dictionary object)
			}
			if(event.which === 37) { // If left arrow key
				kerning--;
				jQuery(activeEl).css('margin-left', kerning);
				adjustments[jQuery(activeEl).attr("id")] = kerning; // add/modify the current letter's kerning information to the "adjustments" object.
				generateCSS(adjustments, unit, increment);
			}
			if(event.which === 39) { // If right arrow key
				kerning++;
				jQuery(activeEl).css('margin-left', kerning);
				adjustments[jQuery(activeEl).attr("id")] = kerning; // add/modify the current letter's kerning information to the "adjustments" object.
				generateCSS(adjustments, unit, increment);
			}
		}
	});
}

function generateCSS(adjustments, unit, increment) {
	var x, concatCSS, theCSS;
	theCSS = [];
	for(x in adjustments) {
		if(adjustments.hasOwnProperty(x)) {
			concatCSS = [
				"#" + x + " {",
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
			inject += '<span id="'+klass+(i+1)+'">'+item+'</span>'+after;
		});	
		t.empty().append(inject);
	}
}