$(document).ready(function(){
  $("#panel_arrow").click(function(){
      $("div#toolbox_area_1").toggle();
      $('#content').css('margin-left', $('#toolbox_container').width() + 'px');

});
});