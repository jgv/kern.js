$(function() {
	var activeEl; var kerning = 0; var adjustments = {};
	$(document.body).mouseover(function(event){
		$(event.target).css('opacity', '.8');
	});
	$(document.body).click(function(event) {
		var el = event.target;
		var units; // This variable will control the unit type to be incremented, whether px or em or whatev. (not yet implemented)
		var increment; // This variable will control how many units are moved per keydown. (not yet implemented)
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
		}
		if(event.which === 39) { // If right arrow key
			kerning++;
		}
		$(activeEl).css('margin-left', kerning);
		adjustments[$(activeEl).attr("id")] = kerning; // add/modify the current letter's kerning information to the "adjustments" object.
		console.log(adjustments);
	});
});