$(document).ready(function() {
	//börja med att stätta split_Set till false på alla fields 
	//flaggan används för att avgöra om vi redan 
	//initierat split-funktionen. I Framtiden kanske det skall vara 
	// en flagga på den knapp man använder i toolboxen.
	$(".field").data("split_set", false); 

	$(this).keypress(function(e) {
		// Keycodes för v och h, v skall splitta vertikalt, 
		// h horisontellt
		// h = 104
		// v = 118
		if (e.which == 104 || e.which == 118) {
		    // om flaggan split_set är satt till true skall vi inte
		    // lägga till call-back funktionen en gång till
		    if ($(".field").data("split_set"))
			{
			    return true;
			}
		    $(".field").data("split_set", true); 

		    var split_vertically = e.which == 118;
		    find_split(split_vertically);
		}
	    });
    });

function find_split(split_vertically) {
    
    $(".field").bind("click",split_function = function(e) {
	    
		if (split_vertically) {
		    split_field_vertically(e,$(this));
		}
		else {
		    split_field_horizontally(e,$(this));
		}
		
		// När vi är färdiga med en split sätter vi flaggan till
		//false för alla fields, så att en ny split kan göras
		$(".field").data("split_set", false); 

		//vi tar bort split-callbackfunktionen för alla fields
		$(".field").unbind("click",split_function);
		
	    });
   
};

function split_field_horizontally(e, field) {
    var new_height = field.height()/2;
    var new_field = field.clone();
    new_field.html(''); //radera innehållet i klonen
    
    new_field.offset({top:new_height}); //adderar positionen till det nya fältet
    new_field.height(new_height);
    field.height(new_height);

    field.after(new_field);
}

function split_field_vertically(e, field) {
    var new_width = field.width()/2;
    var new_field = field.clone();
    new_field.html(''); //radera innehållet i klonen
    
    new_field.offset({left:new_width}); //adderar positionen till det nya fältet
    new_field.width(new_width);
    field.width(new_width);

    field.after(new_field);
};