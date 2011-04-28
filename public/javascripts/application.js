// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
(function($){
	jQuery.fn.id8Up = function(){
		return this.attr("id").split("_").pop();
	}
})(jQuery);

// Litet plugin för att göra fields resizable
//Behöver kanske inte vara ett plugin men jag ville prova
(function($){
    jQuery.fn.resize8up = function(){

	var handler_s = $('<div></div>');
	handler_s.addClass("resizable8up-handle");
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
