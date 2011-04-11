function select(e, caller) {
    if (e.target != caller) {
	return true;
    };
    $(e.target).toggleClass("selected");
    //colour_change(e.target);
};

$(document).ready(
		  function()
		  {
		      $('.note').click(function(e) 
				       {
					   select(e, this);
				       });
			  
		  });