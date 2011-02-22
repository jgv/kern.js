$(function() {
	$(document.body).click(function(event) {
		var el = event.target;
		$(el).lettering();
		$(el).children().css('opacity', '.5');
		$(el).children().mouseover(function(event) {
			$(this).css('opacity', '1');
			$(this).click(function(event) {
				var activeEl = event.target;
				var kerning = 0;
				$(activeEl).css('color', 'red');
				$(document).keydown(function(event){
					if(event.which === 37) {
						kerning--;
						var leftmargin = $(activeEl).css('margin-left');
						$(activeEl).css('margin-left', kerning);
						console.log(activeEl);
					}
					if(event.which === 39) {
						kerning++;
						var rightmargin = $(activeEl).css('margin-left');
						$(activeEl).css('margin-left', kerning);
						console.log(activeEl);
					}
 				});
			});
		}).mouseleave(function() {
			$(this).css('opacity', '.5');
		});
	});
});