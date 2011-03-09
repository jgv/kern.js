/*
 * Kern.JS 0.1

 * Copyright 2011, Brendan Stromberger, www.brendanstromberger.com
 * Special thanks to Mathew Luebbert for significant code contributions
 * Thanks to the Lettering.JS team for being so cool.
 * Released under the WTFPL license 
 * http://sam.zoy.org/wtfpl/

 * Thanks to the Lettering.JS team for their amazing plugin and making the web a better place.
 * Date: Monday, March 7 2011
 */

(function() {

    function kern() {
	      var activeEl, unit, increment, kerning, adjustments, activeHeader;
	      kerning = 0;
	      adjustments = {};
	      var lastX;
        var thePanelLocation = "http://github.com/jgv/kern.js/raw/master/css/panel.css"; // change this to wherever the css is being hosted
        var panelCss = document.createElement("link");
        panelCss.setAttribute("href", thePanelLocation);
        panelCss.setAttribute("rel", "stylesheet");
        panelCss.setAttribute("type", "text/css");
        document.getElementsByTagName("head")[0].appendChild(panelCss);

        var thePanel = document.createElement("div");
        thePanel.id = "kernjs";
        thePanel.setAttribute("class", "kernjs_panel");

        var html = "<div class='kernjs_button'>";
				html += "<a class='btn' href='#' class='kernjs_finish'><span>Finish Editing</span></a>";
			  html += "</div>";

        thePanel.innerHTML = html;
        
        document.getElementsByTagName("body")[0].appendChild(thePanel);
	      
	      jQuery("h1, h2, h3, h4, h5, h6").click(function(event) { // Activate a word
		        if(activeHeader !== this)
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
				            jQuery(activeEl).css('color', '#00baff').css('opacity', 1);
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
		        
            var outputPanel = document.createElement("div");
            thePanel.setAttribute("class", "kernjs_overlay");

            var outputHtml = "<div class='kernjs_container'>";

					  outputHtml += "<div class='kernjs_instructions'>";
            outputHtml += "<div class='kernjs_p'>";
            outputHtml += "<p>Looks awesome. Here\'s the CSS for your lovely letters. Paste the following CSS into a stylesheet and include it in your page, then use the wonderfully easy-to-use";
            outputHtml += "<a class='kernjs_style' href='http://www.letteringjs.com\'>Lettering.JS</a> to create the necessary style hooks.</p><br />";
            outputHtml += "<textarea>" + generateCSS(adjustments) + "</textarea>";
            outputHtml += "<div class='kernjs_button kernjs_finish'>";
            outputHtml += "<li><a class='btn' href='#'><span class='kernjs_continue'>Continue Editing</span></a></li>";
            outputHtml += "</div>";
            outputHtml += "<div class='kernjs_contact'>Please email <a class='kernjs_style' href='mailto:contact@kernjs.com'>contact@kernjs.com</a> if you have any trouble</div></div>";
            outputHtml += "</div>";
						outputHtml += "</div>";

            document.getElementsByTagName("body")[0].appendChild(thePanel);
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


	      var outputPanel = jQuery(".kernjs_panel a").mouseup(function() {
		        
            var outputPanel = document.createElement("div");
            outputPanel.id = "kernjs";
            outputPanel.setAttribute("class", "kernjs_overlay");

            var outputHtml = "<div class='kernjs_container'>";
					  outputHtml += "<div class='kernjs_instructions'>";
            outputHtml += "<div class='kernjs_p'>";
            outputHtml += "<p>Looks awesome. Here\'s the CSS for your lovely letters. Paste the following CSS into a stylesheet and include it in your page, then use the wonderfully easy-to-use";
            outputHtml += "<a class='kernjs_style' href='http://www.letteringjs.com\'>Lettering.JS</a> to create the necessary style hooks.</p><br />";
            outputHtml += "<textarea>" + generateCSS(adjustments) + "</textarea>";
            outputHtml += "<div class='kernjs_button kernjs_finish'>";
            outputHtml += "<li><a class='btn' href='#'><span class='kernjs_continue'>Continue Editing</span></a></li>";
            outputHtml += "</div>";
            outputHtml += "<div class='kernjs_contact'>Please email <a class='kernjs_style' href='mailto:contact@kernjs.com'>contact@kernjs.com</a> if you have any trouble</div></div>";
            outputHtml += "</div>";
						outputHtml += "</div>";

            outputPanel.innerHTML = outputHtml;            
            document.getElementsByTagName("body")[0].appendChild(outputPanel);

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

    kern();

})();
