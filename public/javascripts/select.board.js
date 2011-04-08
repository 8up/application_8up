$(document).ready(function(){
  $("#boards_container li").click(function(e){
      $(e.target).toggleClass("selected");
  });
  $(".toolbox_button_delete").click(function(){
    $(".selected").remove()
  });
});