// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
$(document).ready(function(){
	set_page_context();
    });

function set_page_context() {
    var pathname = window.location.pathname;
    var array = pathname.split("/");

    // Ta bort alla tomma element ur arrayen
    array = array.filter(function(element) { return element != "";});
	
    var lastElement = array.pop();
    //Om sista elementet inte är ett NaN, så är det ett nummer, och 
    // vi antar att vi är i ett whiteboard
    if (!isNaN(lastElement)) {
	window.page_context = 'whiteboard';
    }
    else {
	window.page_context = 'start_page';
    }
  
};

(function($){
	jQuery.fn.id8Up = function(){
		return this.attr("id").split("_").pop();
	}
})(jQuery);

// Litet plugin för att göra fields resizable
//Behöver kanske inte vara ett plugin men jag ville prova
(function($){
    jQuery.fn.resize8up = function(){
	// Kolla att vi inte redan lagt till handlers
	if ($(this).children('.resizable8up-handle').length != 0) {
	    return true;
	}

	var handler_s = $('<div></div>');
	handler_s.addClass("resizable8up-handle");
  //handler_s.handle_mouseenter();
	handler_s.bind("onmousedown", function(event) {
		event.preventDefault();
		return false;
	    });
	handler_s.bind("onselectstart",   function () { 
		return false; 
	    });
	var handler_n = handler_s.clone();
	var handler_w = handler_s.clone();
	var handler_e = handler_s.clone();

	handler_n.addClass("resizable8up-n");
	handler_w.addClass("resizable8up-w");
	handler_e.addClass("resizable8up-e");
	handler_s.addClass("resizable8up-s");

	$(this).append(handler_n);
	$(this).append(handler_e);
	$(this).append(handler_w);
	$(this).append(handler_s);
    }
})(jQuery);

$.fn.selectRange = function(start, end) {
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};
