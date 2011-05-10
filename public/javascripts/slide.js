$(document).ready(
	function(){
	    var toolbar_state = get_toolbar_state();

	    if (toolbar_state == null) {
		$("div#toolbox_area_1").show();
		save_toolbar_state();
		$("#panel_arrow").attr("src", "/images/panel_button_left.png");
	    }
	    else if (toolbar_state == "expanded") {
		$("div#toolbox_area_1").show();
		$("#panel_arrow").attr("src", "/images/panel_button_left.png");
	    }
	    else {
		$("div#toolbox_area_1").hide();
		$("#panel_arrow").attr("src", "/images/panel_button_right.png");
				
	    }
	 	 
	    resize_workspace();

	    $("#toolbox_area_2").click(function(){
		    $("div#toolbox_area_1").toggle();
		    resize_workspace();
		    save_toolbar_state();		
		    
		    var panel_arrow=$("#panel_arrow");
		    
		    if (panel_arrow.attr("src")== "/images/panel_button_left.png")
			{
			    panel_arrow.attr("src", "/images/panel_button_right.png");
			} else {
			panel_arrow.attr("src", "/images/panel_button_left.png");
		    }
		});
	}
	
);

function resize_workspace() {
    
    if(window.page_context == 'start_page'){
	var old_width = $('#workspace').width();
	var toolbox_width = $('#toolbox_container').width();
	$('#workspace').css('margin-left', toolbox_width + 'px');
	$('#workspace').width($(window).width() - toolbox_width); 
			  
    } 
};

function save_toolbar_state() {
    var state = "expanded";
    var user = window.current_user;
    if ($("div#toolbox_area_1").css("display") == "none") {
	state = "hidden";
    }
    if (typeof(localStorage) == 'undefined' ) {
	alert('Your browser does not support HTML5 localStorage. Try upgrading.');
	return;
    } 
    
    try {
	var toolbox_state = JSON.parse(localStorage.getItem("hjortron_toolbar_state"));
	toolbox_state[user] = state; 
	 //saves to the database, "key", "value"
	localStorage.setItem("hjortron_toolbar_state", 
			     JSON.stringify(toolbox_state));
    } catch (e) {
	if (e == QUOTA_EXCEEDED_ERR) {
	    //data wasn't successfully saved due to quota exceed so throw an error
	    alert('Quota exceeded on local storage!');
	}
    }
}


function get_toolbar_state() {
    var user = window.current_user;
    if (typeof(localStorage) == 'undefined' ) {
	alert('Your browser does not support HTML5 localStorage. Try upgrading.');
	return;
    }
    var toolbox_text_state = localStorage.getItem("hjortron_toolbar_state");
    var toolbox_state = JSON.parse(toolbox_text_state); 
    
    return toolbox_state[user];
}