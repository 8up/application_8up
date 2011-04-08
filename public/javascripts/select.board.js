$(document).ready(function(){
  $("#boards_container li").click(function(e){
      $(e.target).toggleClass("selected");
  });
  $(".toolbox_button_delete").click(function(){
    $(".selected").remove()
  });
  $("div#toolbox_area_2").click(function(){
      $("div#toolbox_area_1").toggle();
      $('#content').css('margin-left', $('#toolbox_container').width() + 'px');
});
});