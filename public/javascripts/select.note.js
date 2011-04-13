//Funktion för att lägga till eller ta bort klassen selected från objektet.
function select(e, caller) {
	if (e.target != caller) {
		return true;
	};
	$(e.target).toggleClass("selected");
};

function de_select(e, caller){
	if(e.target != caller){
		return true;
	};
	$(".selected").removeClass("selected");
}


$(document).ready(
	function()
	{

		$('.field').click(function(e){
			de_select(e, this);
			$("#toolbox_container").trigger("update");

		});

		$('.note').click(function(e) 
		{
			select(e, this);
			$("#toolbox_container").trigger("update");
		});
	}
);
