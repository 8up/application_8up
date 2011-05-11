/*
 Tools skall fungera så här: det finns två varianter, momentana och aktiverade.
 Momentana utför den önskade åtgärden direkt (delete, add board, invite)
 Aktiverade (add note, split field, osv) sätter verktyget som aktivt, varvid alla andra sätts 
 till icke-aktiva. Det aktiva verktyget skall deaktiveras när det utfört sin handling
 Klasser på tools som används:
 tool - alla tools skall ha denna klass
 tool_active - talar om ifall ett verktyg är aktivt

 data som används på tools:
 data-tool_type: [instant, activated, toggle] - talar om vilken sorts verktyg det är
 data-tool_state: [active, inactive] - vilket tillstånd detta tool är i, i första hand används det för aktiverade tools för att aktivera om man trycker på samma tool två gånger
 data-tool_data: data som ett tool behöver för att köras
 
 Alla tools skall ha handlers som lyssnar på eventet 'activate'. Tools som är 
 aktiverbara skall också ha en funktion som lyssnar på 'deactivate'
*/

//Jquery-funktion som deaktiverar tools
(function($){
	jQuery.fn.tool_deactivate = function(){
	    this.each( function() {
		    $(this).trigger('deactivate');
		    if ($(this).data('tool_state') == "active") {
			$(this).removeClass("tool_active");
			$(this).data('tool_state', "inactive");
		    }    
		})
	}
})(jQuery);


// Denna funktion ser till att aktivera verktygets funktion, och deaktivera alla andra
function tool_pressed_handler(event) {
    var tool = $(event.target);

    // Om eventet inte är ett tool returnerar vi bara
    if (!tool.hasClass('tool')) {
	return true;
    }
    
    if (tool.data('tool_type') == "activated") {
	//Kolla om verktyget redan var aktivt, i sådana fall skall det deaktiveras

	if (tool.data('tool_state') == "active") {
	    tool.tool_deactivate();
	    return true;
	}	
	//deaktivera alla tools
	$(".tool").tool_deactivate();
	   
	//Aktivera detta tool
  	tool.data('tool_state', "active");
	tool.addClass('tool_active');
	
	tool.trigger('activate');
    }
    else if (tool.data('tool_type') == "instant") {
	$(".tool").tool_deactivate();
	tool.trigger('activate'); //kör verktyget
    }
    else if (tool.data('tool_type') == "toggle")
	{
	    //Här skall kod för toggle-tool finnas, exempelvis avatar-verktyget
	}
}
