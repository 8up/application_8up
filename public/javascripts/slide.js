$(document).ready(
	function(){
		$("#toolbox_area_2").click(function(){
			$("div#toolbox_area_1").toggle();
			if(window.page_context == 'start_page'){
			  $('#content').css('margin-left', $('#toolbox_container').width() + 'px');
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