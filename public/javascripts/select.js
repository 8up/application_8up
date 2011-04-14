function de_select(e, caller){
	if(e.target != caller){
		return true;
	};
	//Skapar eller tar bort klassen selected från objektet.
	$(".selected").removeClass("selected");
	$("#toolbox_container").trigger("update");
	
};

function select(e, caller) {
	if (e.target != caller) {
		return true;
	};
	//Skapar eller tar bort klassen selected från objektet.
	$(e.target).toggleClass("selected");
	$("#toolbox_container").trigger("update");
	
};

$(document).ready(
	function(){
		$('.field').click(function(e){
			de_select(e, this);
		});

		$('.note').click(function(e) 
		{
			select(e, this);
		});
		
		$("#cont").click(function(e){
			de_select(e, this);
		});
		
		$("#cont div").click(function(e){
			select(e,this);
		});
	}
);
