$(document).ready(
	function(){
	  var old_width = $('#workspace').width();
	  var toolbox_width = $('#toolbox_container').width();
	  $('#workspace').css('margin-left', toolbox_width + 'px');
	  
	  $('#workspace').width($(window).width() - toolbox_width); 
    
		$("#toolbox_area_2").click(function(){
			$("div#toolbox_area_1").toggle("slide", 150);
			
			if(window.page_context == 'start_page'){
			  var old_width = $('#workspace').width();
			  var toolbox_width = $('#toolbox_container').width();
			  $('#workspace').css('margin-left', toolbox_width + 'px');
			  
			  $('#workspace').width($(window).width() - toolbox_width); 
			  
			}
			var panel_arrow=$("#panel_arrow");
			if (panel_arrow.attr("src")== "/images/panel_button_right.png") {
				panel_arrow.attr("src", "/images/panel_button_left.png");
			} else {
				panel_arrow.attr("src", "/images/panel_button_right.png");
			}
		});
	}
	
);