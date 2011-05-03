$(document).ready(function () {
  
 $("input#invite_input").autocomplete({
    minLength: 0,
    max: 2,
    source: "/users.json"
  });
    
  $('.invite_submit').click(function(){
    var board_id = $('.board_div').id8Up();
    var invite_id = $("#invite_input").val();
    $.ajax({ url: board_id +'/invite/', 
		type: 'POST', 
		data: {
		  'email': invite_id,
	  },
	  success: function(data){
	    if(data.status == "ok"){
	      $("#window_wrapper").hide();
        $( "#invite_window" ).hide();
        $("#invite_input").val('');
      }
      else{
        alert(data.message);
      }
	  }
  })
  })
  $('.cancel').click(function(){
     $("#window_wrapper").hide();
     $( "#invite_window" ).hide();
     $("#invite_input").val('');
     
   })
})

function show_invite(){
    $("#window_wrapper").show();
    $( "#invite_window" ).show();
    $('#in_focus_image').hide();	
};


