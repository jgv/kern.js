/*
* Kern.JS 0.2.6
* http://www.kernjs.com
* Built by Brendan Stromberger, www.brendanstromberger.com
* Special thanks to Mathew Luebbert at www.luebbertm.com for significant code contributions
* Special thanks to Jonathan Vingiano <jonathanvingiano.com> for making the Kern.js engine purr.
* Thanks to the Lettering.JS team for being so cool and making the web a better place.
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
* Date: Sunday, April 10 2011
*/
 (function() {
    function kern() {
        var activeEl,
        kerning,
        adjustments,
        thePanel,
        thePanelLocation,
        panelCss,
        html,
        activeHeader,
        emPx,
        lastX,
        unitFlag,
        location;
        location = "https://github.com/bstrom87/kern.js/raw/master/";
        kerning = 0;
        adjustments = {};

        thePanelLocation = location + "kernjs.css";

        panelCss = document.createElement("link");
        panelCss.setAttribute("href", thePanelLocation);
        panelCss.setAttribute("rel", "stylesheet");
        panelCss.setAttribute("type", "text/css");
        document.getElementsByTagName("head")[0].appendChild(panelCss);

        thePanel = document.createElement("div");
        thePanel.id = "panel";
        thePanel.setAttribute("class", "kernjs_panel");
        jQuery(thePanel).css('opacity','0');

        html = '<div class="kernjs_panel">';
        html +=     '<div class="kernjs_unitSelect">';
        html +=         '<form class="kernjs_unit" action="">';
        html +=             '<section><input type="button" id="em" type="button" name="kernjs_unit" value="em" /></section>';
        html +=             '<section><input type="button" type="button" name="kernjs_unit" value="px" /></section>';
        html +=     '   </form>';
        html +=     '</div>';

        html +=     '<div class="kernjs_button">';
        html +=         '<a class="btn" href="#" class="kernjs_finish"><span>Finish Editing</span></a>';
        html +=     '</div>';
        html += '</div>';

        thePanel.innerHTML = html;
        jQuery("body").prepend(thePanel);

        jQuery(".kernjs_panel") // push down content below kernjs_panel
            .after(jQuery("<div id='spacer'></div>")
            .css('height', jQuery(".kernjs_panel").css("height")));

        jQuery(".kernjs_panel").animate({
            opacity: 1
        });

        jQuery(".kernjs_unitSelect input").click(function() {
            jQuery(".kernjs_unitSelect input")
                .css('background-color', '#FFF')
                .css('color','#000');
            jQuery(this)
                .css('background-color','#222')
                .css('color','#FFF');
            unitFlag = jQuery(this).attr('value');
        });
        jQuery('.kernjs_unitSelect #em').click();

        //This function takes the stored adjustment data and constructs formatted CSS from it.
        function generateCSS(adjustments, emPx, unitFlag) {
            var x, concatCSS, theCSS;
            theCSS = [];
            for (x in adjustments) {
                if (adjustments.hasOwnProperty(x)) {
                    if (unitFlag === 'em') {
                        concatCSS = [x + " {", '\t' + 'margin-left: ' + (Math.round((adjustments[x] / emPx) * 1000) / 1000).toString() + 'em', '}'].join('\n'); // This sweet little line performs the pixel->em conversion. Booya.
                    }
                    if (unitFlag === 'px') {
                        concatCSS = [x + " {", '\t' + 'margin-left: ' + adjustments[x].toString() + 'px', '}'].join('\n');
                    }
                    theCSS = theCSS + '\n' + concatCSS;
                }
            }
            return theCSS;
        }

        // This function finds the h(x) tag wrapping the thing you clicked
        function findRootHeader(el) {
            var toReturn;
            toReturn = el;
            while (jQuery.inArray(jQuery(toReturn).get(0).tagName, ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']) < 0)
            {
                toReturn = jQuery(toReturn).parent();
            }
            return toReturn;
        }

        // The following two functions (splitter and injector) are modified versions of Lettering.JS functions. Using these allows Lettering.JS and Kern.JS to work together well.
        function splitter(el) {
            if (jQuery(el).children().length === 0)
            {
                return injector(jQuery(el), '', 'char', '');
            }
            return jQuery.each(el.children(),
            function(index, value) {
                splitter(value);
            });
        }
        function injector(t, splitter, klass, after) {
            var a = t.text().split(splitter),
            inject = '';
            if (a.length > 1) {
                jQuery(a).each(function(i, item) {
                    inject += '<span class="' + klass + (i + 1) + '">' + item + '</span>' + after;
                });
                t.empty().append(inject);
            }
        }

        jQuery("h1, h2, h3, h4, h5, h6").click(function(event) { // Activate a word
            var emRatio, el, previousColor, theHtml, elid;
            elid = ""; // if the user clicks on a header element with an ID, elid is set to be equal to the ID of the header element.
            event.preventDefault(); // Prevent headers that are also links from following the URL while Kern.JS is active.
            if (activeHeader !== this) {
                activeHeader = this;
                emRatio = jQuery("<span />").appendTo(event.target).css('height', '1em').css('visibility', 'hidden'); // This little guy finds the pixel size of 1em.
                emPx = emRatio.height();
                emRatio.detach(); // Retrieves the height value from emRatio, store it, and destroy emRatio since we don't need it anymore.
                el = findRootHeader(event.target);
                
                if($(el).attr('id')) { // If the clicked header has an ID...
                    elid = "#" + $(el).attr('id') + " "; //...set elid to be a css string representation of the header's id (for example, "#myheader")
                    console.log(elid);
                }
                else {
                    console.log(elid);
                }
                
                
                previousColor = 0;
                
                if($)
                theHtml = splitter(jQuery(el)); // Call method from Lettering.js. This method splits up the clicked body of text into <span> elements containing single letters.	

                jQuery(this)
                    .attr('unselectable', 'on')
                    .css('-moz-user-select', 'none')
                    .each(function() {
                        this.onselectstart = function() {
                            return false;
                        };
                    });

                jQuery(el)
                    .children()
                    .css('opacity', '.5');

                jQuery(this).mousedown(function(event) { // Listens for clicks on the newly created span objects.
                    if (previousColor !== 0) {
                        jQuery(activeEl).css('color', previousColor).css('opacity', 0.5);
                    }
                    activeEl = event.target; // Set activeEl to represent the clicked letter.
                    previousColor = jQuery(activeEl).css('color');

                    jQuery(activeEl)
                    .css('color', '#00baff')
                    .css('opacity', 1);

                    lastX = event.pageX;
                    if (typeof(adjustments[elid + "." + jQuery(activeEl).attr("class")]) === 'undefined')
                    {
                        adjustments[elid + "." + jQuery(activeEl).attr("class")] = 0;
                    }
                    kerning = adjustments[elid + "." + jQuery(activeEl).attr("class")];
                    function MoveHandler(event)
                    {
                        var moveX = event.pageX - lastX;
                        if (moveX !== 0)
                        {
                            lastX = event.pageX;
                            kerning += moveX;
                            adjustments[elid + "." + jQuery(activeEl).attr("class")] = kerning;
                            jQuery(activeEl).css('margin-left', kerning.toString() + 'px'); // make live adjustment in DOM
                            generateCSS(adjustments, emPx, unitFlag); // make stored adjustment in generated CSS
                        }
                    }
                    jQuery(this).bind('mousemove', MoveHandler);
                    jQuery(this).mouseup(function(event) {
                        jQuery(this).unbind('mousemove', MoveHandler);
                    });
                });
                // end el click
            }
        });
        jQuery(document).keydown(function(event) { // This feels cludgy and should probably be rewritten at some point b/c there is a lot of reused code.
            var elid = "";
            if (activeEl) {
                if (jQuery(activeEl).parent().attr('id')) {
                    elid = "#" + jQuery(activeEl).parent().attr('id') + " ";
                }
                if (adjustments[elid + "." + jQuery(activeEl).attr("class")]) { // If there are current adjustments already made for this letter
                    kerning = adjustments[elid + "." + jQuery(activeEl).attr("class")]; // Set the kerning variable to the previously made adjustments for this letter (stored inside the adjustments dictionary object)
                }
                if (event.which === 37) { // If left arrow key
                    kerning--;
                    jQuery(activeEl).css('margin-left', kerning.toString() + 'px');
                    adjustments[elid + "." + jQuery(activeEl).attr("class")] = kerning; // add/modify the current letter's kerning information to the "adjustments" object.
                    generateCSS(adjustments, emPx, unitFlag);
                }
                if (event.which === 39) { // If right arrow key
                    kerning++;
                    jQuery(activeEl).css('margin-left', kerning.toString() + 'px');
                    adjustments[elid + "." + jQuery(activeEl).attr("class")] = kerning; // add/modify the current letter's kerning information to the "adjustments" object.
                    generateCSS(adjustments, emPx, unitFlag);
                }
            }
        });
        outputPanel = jQuery(".kernjs_panel a").mouseup(function() {
            var outputPanel, outputHTML;
            outputPanel = document.createElement("div");
            outputPanel.id = "overlay";
            outputPanel.setAttribute("class", "kernjs_overlay");
            
            if(activeEl) {
                outputHTML = '<div class="kernjs_overlay">';
                outputHTML += '<div class="kernjs_container">';
                outputHTML += '<div class="kernjs_instructions">';
                outputHTML += '<div class="kernjs_p kernjs_success"><em>Looks awesome.</em> Here\'s the CSS for your lovely letters. Paste the following CSS into a stylesheet and include it in your page, then use the wonderfully easy-to-use <a class="kernjs_style" href="http://www.letteringjs.com\">Lettering.JS</a> to create the necessary style hooks.</div><br/>';
                outputHTML += '<textarea>' + generateCSS(adjustments, emPx, unitFlag) + '</textarea>';
                outputHTML += '<div class="kernjs_button kernjs_finish">';
                outputHTML += '<a class="btn" href="#"><span class="kernjs_button" id="kernjs_continue">Continue Editing</span></a>';
                outputHTML += '</div>';
                outputHTML += '<div class="kernjs_contact">Please email <a class="kernjs_style" href="mailto:contact@kernjs.com">contact@kernjs.com</a> if you have any trouble</div></div>';
                outputHTML += '</div>';
                outputHTML += '</div';
                outputHTML += '</div>';
            }
            else {
                outputHTML = '<div class="kernjs_overlay">';
                outputHTML += '<div class="kernjs_container">';
                outputHTML += '<div class="kernjs_instructions">';
                outputHTML += '<div class="kernjs_p kernjs_error"><em>Oops.</em> It looks like you haven\'t made any adjustments yet.</div>';
                outputHTML += '<div class="kernjs_button kernjs_finish"><a class="btn" href="#"><span class="kernjs_button" id="kernjs_continue">Try again.</span></a></div>';
                outputHTML += '</div></div>';
            }
                outputHTML += '<a href="http://www.kernjs.com" target="_blank"><img src="' + location + 'logo.png" id="kernjs_logo"/></a>';
                outputHTML += '<h6>(opens a new window)</h6>'

            outputPanel.innerHTML = outputHTML;
            document.getElementsByTagName("body")[0].appendChild(outputPanel);

            jQuery(".kernjs_overlay").animate({
                "opacity": 1
            },
            function() { // callback function here if we want to add any animations for the overlayed content later
                });

            jQuery("#kernjs_continue").click(function() {
                jQuery(".kernjs_overlay").fadeOut(function() {
                    jQuery(this).detach();
                });
            });
        });
    }
    kern();
})();