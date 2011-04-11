// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
(function($){
	jQuery.fn.id8Up = function(){
		return this.attr("id").split("_").pop();
	}
})(jQuery);
