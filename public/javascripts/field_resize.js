// Litet plugin för att göra fields resizable
//Behöver kanske inte vara ett plugin men jag ville prova
(function($){
    jQuery.fn.resize8up = function(){

	var handler_s = $('<div></div>');
	handler_s.addClass("resizable8up-handle");

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

	//Detta stänger av oönskade beteenden  vid mousedown
	$(".resizable8up-handle").each(function() {
		this.onselectstart = function() { return false; };
		this.onmousedown = function(event) { 
		    event.preventDefault();
		    return false; 
		};
	    });
	
	$("resizeable8up-handle").mousedown();

    }
})(jQuery);
