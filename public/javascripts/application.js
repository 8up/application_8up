// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
$(document).ready(function(){
  $.preLoadImages('/images/postit_yellow.png',
                  '/images/postit_yellow_select.png',
                  '/images/postit_green.png',
                  '/images/postit_green_select.png',
                  '/images/postit_blue.png',
                  '/images/postit_blue_select.png',
                  '/images/postit_red.png',
                  '/images/postit_red_select.png',
                  '/images/postit_orange.png',
                  '/images/postit_orange_select.png');
});

function set_page_context() {
  var pathname = window.location.pathname;
  var array = pathname.split("/");

  // Ta bort alla tomma element ur arrayen
  array = _.filter(array, function(element) { return element != "";});

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
//Vi behöver inte köra den här funktionen på readyeventet då den inte anväder DOM.
set_page_context();

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

      handler_s.live("onmousedown", function(event) {
        event.preventDefault();
        return false;
      });
      handler_s.live("onselectstart",   function () { 
        return false; 
      });
      var handler_n = handler_s.clone();
      var handler_w = handler_s.clone();
      var handler_e = handler_s.clone();

      handler_n.addClass("resizable8up-n");
      handler_w.addClass("resizable8up-w");
      handler_e.addClass("resizable8up-e");
      handler_s.addClass("resizable8up-s");

      $(this).append(handler_e);
      $(this).append(handler_s);

      if($(this).position().top != 0)
      {
        $(this).append(handler_n);
      }
      if($(this).position().left != 0)
      {
        $(this).append(handler_w);
      }


    }
    var cache = [];
    $.preLoadImages = function() {
      var args_len = arguments.length;
      for (var i = args_len; i--;) {
        var cacheImage = document.createElement('img');
        cacheImage.src = arguments[i];
        cache.push(cacheImage);
      }
    }
})(jQuery);