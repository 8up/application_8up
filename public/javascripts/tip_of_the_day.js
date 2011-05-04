$(document).ready(function(){
  
var tips = [];
tips[0]='Double-click any field to create a new note.'
tips[1]='Select one or more notes and then click on your avatar to place the avatar on the note.'
tips[2]='Use the invite tool located in the toolbox to share boards among friends.'
tips[3]='Press Ctrl or Cmd to select more than one note.'
tips[4]='Select one or more notes and then click on a color to change the color of the note.'
tips[5]='Use the split buttons to split the fields.'
tips[6]='Remove a note by selecting it and then clicking delete.'
tips[7]='Press account to change your user settings.'
tips[8]='Double-click a note to get the full size view.'


$('#tip_of_the_day_list').text(tips[Math.floor(Math.random()*10)])
});
