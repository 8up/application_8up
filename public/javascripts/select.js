(function(){
function de_select_all(e, caller){
  if(e.target != caller){
		return true;
	};
	//Skapar eller tar bort klassen selected från objektet.
	$(".selected").removeClass("selected").trigger('deselect');
	$("#toolbox_container").trigger("update");
};
function de_select_element(element){
  $(element).removeClass("selected").trigger('deselect');
  $("#toolbox_container").trigger("update");
}

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
			de_select_all(e, this);
		});

    var notes = $('.note');
		notes.live('click', function(e) 
		{
		  if(!e.metaKey && !e.ctrlKey){
		    notes.each(function(index, element){
  		    de_select_element(element);
  	    });
	    }
		  select(e, this);
		});
		
		$( ".note" ).live('dblclick', function(e){
      //if(e.target === this)
      note_box(e);
    });
		
		$("#workspace").click(function(e){
			de_select_all(e, this);
		});
		
		$("#cont div").click(function(e){
			select(e,$(this).closest("div"));
		});
	}
);
})();
