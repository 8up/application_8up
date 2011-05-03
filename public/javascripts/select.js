function de_select(e, caller){
	if(e.target != caller){
		return true;
	};
	//Skapar eller tar bort klassen selected från objektet.
	$(".selected").removeClass("selected").trigger('deselect');
	$("#toolbox_container").trigger("update");
	
};

function select(e, caller) {
/*	if (e.target != caller) {
		return true;
    };*/
	//Skapar eller tar bort klassen selected från objektet.
	$(caller).addClass("selected").trigger('select');
	$("#toolbox_container").trigger("update");
};

$(document).ready(
	function(){
		$('.field').live('click',function(e){
			de_select(e, this);
		});

		$('.note').live('click', function(e) 
		{
			select(e, this);
		});
		
		$( ".note" ).live('dblclick', function(e){
      //if(e.target === this)
      note_box(e);
    });
		
		$("#workspace").click(function(e){
			de_select(e, this);
		});
		
		$("#cont div").click(function(e){
			select(e,$(this).closest("div"));
		});
	}
);
