$(function() {
	var activeEl; var unit; var increment; var kerning = 0; var adjustments = {};
	var thePanel =
		['<style>',
			'#kernjs_panel { height: auto; width: 290px; padding: 30px; -moz-border-radius: 0 0 0 10px; -webkit-border-radius: 0 0 0 10px; border-radius: 0 0 0 10px; position: absolute; right: 0; top: 0; background: black }',
			'#kernjs_panel textarea { -moz-border-radius: 10px; -webkit-border-radius: 10px; border-radius: 10px; width: 280px; height: 300px; padding: 10px;',
		'</style>',

		'<div id="kernjs_panel">',
			'<form>',
				'<textarea>',
				'</textarea>',
			'</form>',
		'</div>'
	].join('\n');
	
	$(document.body).append(thePanel);
	
	$("h1, h2, h3, h4, h5, h6").click(function(event) { // Activate a word
		var el = event.target;
		$(el).lettering(); // Call method from Lettering.js. This method splits up the clicked body of text into <span> elements containing single letters.
		$(el).children().css('opacity', '.5');
		$(el).children().mouseover(function() {
			$(this).css('opacity', '1');
			$(this).click(function(event) { // Listens for clicks on the newly created span objects.
				activeEl = event.target; // Set activeEl to represent the clicked letter.
				$(activeEl).css('color', 'red');
			}); // end el click		
		});
		kerning = 0;
	});
	
	$(document).keydown(function(event) {
		if(adjustments[$(activeEl).attr("id")]) { // If there are current adjustments already made for this letter
			kerning = adjustments[$(activeEl).attr("id")]; // Set the kerning variable to the previously made adjustments for this letter (stored inside the adjustments dictionary object)
		}
		if(event.which === 37) { // If left arrow key
			kerning--;
			$(activeEl).css('margin-left', kerning);
			adjustments[$(activeEl).attr("id")] = kerning; // add/modify the current letter's kerning information to the "adjustments" object.
			$("#kernjs_panel textarea").val(generateCSS(adjustments, unit, increment));
		}
		if(event.which === 39) { // If right arrow key
			kerning++;
			$(activeEl).css('margin-left', kerning);
			adjustments[$(activeEl).attr("id")] = kerning; // add/modify the current letter's kerning information to the "adjustments" object.
			generateCSS(adjustments, unit, increment);
			$("#kernjs_panel textarea").val(generateCSS(adjustments, unit, increment));
		}
	});
});

function generateCSS(adjustments, unit, increment) {
	var x; var concatCSS;
	var theCSS = [];
	for(x in adjustments) {
		if(adjustments.hasOwnProperty(x)) {
			concatCSS = [
				"#" + x + " {",
				'\t' + 'margin-left: ' + adjustments[x] + 'px;',
				'}'
				].join('\n');
				theCSS = theCSS + '\n' + concatCSS;
				console.log(theCSS);
		}
	}
	return theCSS;
}