$(document).ready(function () {
  
  $('.toolbox_button_invite').click(function(){
    $("#window_wrapper").show();
    $( "#invite_window" ).show();
    $('#in_focus_image').hide();
  });
 $("input#invite_input").autocomplete({
    source: ["tjellden@kth.se", "apa@apa.com"]});
    
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


