function de_select_all(e, caller){
  if(e.target != caller){
		return true;
	};
  /*
  if($(".selected").hasClass("note")){
    $(".selected").each(function(index,element){
	    var color = $(element).css("background-image").split("_select");
	    $(element).css("background-image", color[0] + color[1]);
	})
	} */
  $(".selected").removeClass("selected").trigger('deselect');
  $("#toolbox_container").trigger("update");
};
function de_select_element(element){
    /*
    var color = $(element).css("background-image").split("_select");
    $(element).css("background-image", color[0] + color[1]);
    */
    $(element).removeClass("selected").trigger('deselect');
    $("#toolbox_container").trigger("update");
}

function select(e, caller) {
/*	if (e.target != caller) {
		return true;
    };*/
	//Skapar eller tar bort klassen selected från objektet.
    /*if($(caller).css("background-image").split("_select")[1] == undefined) {    
    var bg_image = $(caller).css("background-image");
    var color = bg_image.substring(0, bg_image.length-5);
    $(caller).css("background-image", color + "_select.png)");    
    } */
  
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
		    var that = this;
		    $('.note').each(function(index, element){
  		    if(element !== that){ 
  		      de_select_element(element);
		      }
  	    });
	    }
		  select(e, this);
		});
		
		
		
		//När används den här funktionen?
		$("#workspace").click(function(e){
			de_select_all(e, this);
		});
		
		$("div.board_container").live('mouseleave', function(e){
			de_select_element(this);
			$(this).children('.header').css('opacity', 0);
			
		});
		
		$("div.board_container").live('mouseenter', function(e){
			select(e,$(this).closest("div"));
			$(this).children('.header').css('opacity', 1);
		});
		
    
	}
);
