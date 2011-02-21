$(function() {
	$(document.body).click(function(event) {
		var el = event.target;
		$(el).lettering();
		$(el).children().css('opacity', '.5');
		$(el).children().mouseover(function(event) {
			$(this).css('opacity', '1');
			console.log(this);
			$(this).click(function(event) {
				
			});
		}).mouseleave(function() {
			$(this).css('opacity', '.5');
		});
	});
});