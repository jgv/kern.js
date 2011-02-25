if (typeof jQuery == 'undefined') {
	var includejquery = document.createElement("script");
	includejquery.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js";
	// var html_doc = document.getElementsByTagName('head').item(0);
	document.body.appendChild(includejquery);;
	includejquery.onload = kern;
}

function kern() {
	var activeEl, unit, increment, kerning, adjustments, thePanel;
	kerning = 0;
	adjustments = {};
	thePanel =
		['<style>',
			'#kernjs_panel { text-align: center; height: 60px; width: 100%; margin: 0 auto; background: black; font-family: \'Lucida Grande\', \'Helvetica Neue\', Helvetica, arial; }',
			'#kernjs_panel textarea { -moz-border-radius: 10px; -webkit-border-radius: 10px; border-radius: 10px; width: 280px; height: 30px; }',
			'#kernjs_panel ul { list-style-type: none; display: inline-block; }',
			'#kernjs_panel li { display: inline-block; float: left; padding-right: 2em; }',
			'#kernjs_panel a { color: white; }',
		'</style>',

		'<div id="kernjs_panel">',
		'<ul>',
			'<li><a href="#">Copy to Clipboard</a></li>',
			'<li><a href="#">Save to File</a></li>',
			'<li><a href="#">Return to editing</a></li>',
		'</div>'
	].join('\n');

	jQuery(document.body).prepend(thePanel);

	jQuery("h1, h2, h3, h4, h5, h6").click(function(event) { // Activate a word
		var el = event.target;
		var previousColor = 0;
		splitter(jQuery(el)); // Call method from Lettering.js. This method splits up the clicked body of text into <span> elements containing single letters.
		jQuery(el).children().css('opacity', '.5');
		jQuery(el).children().mouseover(function() {
			jQuery(this).click(function(event) { // Listens for clicks on the newly created span objects.
				if(previousColor>0) jQuery(activeEl).css('color', previousColor);
				activeEl = event.target; // Set activeEl to represent the clicked letter.
				previousColor = jQuery(activeEl).css('color');
				jQuery(activeEl).css('color', 'red');
			}); // end el click	
		});
		kerning = 0;
	});

	jQuery(document).keydown(function(event) {
		if(adjustments[jQuery(activeEl).attr("id")]) { // If there are current adjustments already made for this letter
			kerning = adjustments[jQuery(activeEl).attr("id")]; // Set the kerning variable to the previously made adjustments for this letter (stored inside the adjustments dictionary object)
		}
		if(event.which === 37) { // If left arrow key
			kerning--;
			jQuery(activeEl).css('margin-left', kerning);
			adjustments[jQuery(activeEl).attr("id")] = kerning; // add/modify the current letter's kerning information to the "adjustments" object.
//			jQuery("#kernjs_panel textarea").val(generateCSS(adjustments, unit, increment));
		}
		if(event.which === 39) { // If right arrow key
			kerning++;
			jQuery(activeEl).css('margin-left', kerning);
			adjustments[jQuery(activeEl).attr("id")] = kerning; // add/modify the current letter's kerning information to the "adjustments" object.
			generateCSS(adjustments, unit, increment);
//			jQuery("#kernjs_panel textarea").val(generateCSS(adjustments, unit, increment));
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
//				console.log(theCSS);
		}
	}
	return theCSS;
}

function splitter(el) {
	return el.each(function() {
		injector(jQuery(el), '', 'char', '');
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