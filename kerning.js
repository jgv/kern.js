$(function() {
	$(document.body).click(function(event) {
		var el = event.target;
		$(el).lettering();
		$(el).children().css('opacity', '.5');
		$(el).children().mouseover(function(event) {
			$(this).css('opacity', '1');
			console.log(this);
			$(this).click(function(event) {
				var engaged = true;
				$(document.body).keydown(function(event) {
					if(event.which == 37)
					{
						console.log(event.which);
					}
					if(event.which == 39)
					{
						console.log(event.which);
					}
				});
			});
		}).mouseleave(function() {
			$(this).css('opacity', '.5');
		});
	});
});

// 37 is left
// 39 is right