$(document).ready(
	function(){
	    var toolbar_state = get_toolbar_state();
	    if (toolbar_state == null) {
		$("div#toolbox_area_1").show();
		save_toolbar_state();
	    }
	    else if (toolbar_state == "expanded") {
		$("div#toolbox_area_1").show();
	    }
	    else {
		$("div#toolbox_area_1").hide();
	    }
	 	 
	    resize_workspace();

	    $("#toolbox_area_2").click(function(){
		    $("div#toolbox_area_1").toggle();
		    resize_workspace();
		    save_toolbar_state();		
		    
		    var panel_arrow=$("#panel_arrow");
		    
		    if (panel_arrow.attr("src")== "/images/panel_button_right.png") {
			panel_arrow.attr("src", "/images/panel_button_left.png");
		    } else {
			panel_arrow.attr("src", "/images/panel_button_right.png");
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
    if ($("div#toolbox_area_1").css("display") == "none") {
	state = "hidden";
    }
    if (typeof(localStorage) == 'undefined' ) {
	alert('Your browser does not support HTML5 localStorage. Try upgrading.');
	return;
    } 
    
    try {
	 //saves to the database, "key", "value"
	localStorage.setItem("hjortron_toolbar_state", state);
    } catch (e) {
	if (e == QUOTA_EXCEEDED_ERR) {
	    //data wasn't successfully saved due to quota exceed so throw an error
	    alert('Quota exceeded on local storage!');
	}
    }
}


function get_toolbar_state() {
    if (typeof(localStorage) == 'undefined' ) {
	alert('Your browser does not support HTML5 localStorage. Try upgrading.');
	return;
    } 
    var toolbox_state = localStorage.getItem("hjortron_toolbar_state"); 
    
    return toolbox_state;
}