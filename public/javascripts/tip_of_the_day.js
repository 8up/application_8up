$(document).ready(function(){
  
var board_view_tips = [];
board_view_tips[0]='Double-click any field to create a new note.'
board_view_tips[1]='Select one or more notes and then click on your avatar to place the avatar on the note.'
board_view_tips[2]='Use the invite tool located in the toolbox to share boards among friends.'
board_view_tips[3]='Press Ctrl or Cmd to select more than one note.'
board_view_tips[4]='Select one or more notes and then click on a color to change the color of the note.'
board_view_tips[5]='Use the split buttons to split the fields.'
board_view_tips[6]='Remove a note by selecting it and then clicking delete.'
board_view_tips[7]='Press account to change your user settings.'
board_view_tips[8]='Double-click a note to get the full size view.'

var board_overview_tips =[];
board_overview_tips[0] ='Click on a board to open.'
board_overview_tips[1] ='Use the icons on top of the board to invite, edit or remove a board.'
board_overview_tips[2] ='Pressing "New board" in the toolbox lets you create a new board.'
board_overview_tips[3] = board_view_tips[7]
board_overview_tips[4] ='Click on the toolbox border to close the toolbox.'


$('#tip_of_the_day_list').text(board_view_tips[Math.floor(Math.random()*10)%9])
$('#tip_of_the_day_list2').text(board_overview_tips[Math.floor(Math.random()*10)%5])
});
