function de_select(e, caller){
	if(e.target != caller){
		return true;
	};
	$(".selected").removeClass("selected");
	$("#toolbox_container").trigger("update");
	
};

function select(e, caller) {
	if (e.target != caller) {
		return true;
	};
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
		
		$("#boards_container").click(function(e){
			de_select(e, this);
		});
		
		$("#boards_container li").click(function(e){
			//Skapar eller tar bort klassen selected från objektet.
			select(e,this);
		});
	}
);
