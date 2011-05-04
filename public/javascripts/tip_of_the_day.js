$(document).ready(function(){
  
var tips = [];
tips[0]='Double-click any field to create a new note.'
tips[1]='Double-click any field to create a new note.'
tips[2]='Use the invite tool located in the toolbox to share boards among friends.'
tips[3]='Use the invite tool located in the toolbox to share boards among friends.'
tips[4]='Use the invite tool located in the toolbox to share boards among friends.'
tips[5]='Use the invite tool located in the toolbox to share boards among friends.'
tips[6]='Use the invite tool located in the toolbox to share boards among friends.'
tips[7]='Use the invite tool located in the toolbox to share boards among friends.'
tips[8]='Use the invite tool located in the toolbox to share boards among friends.'
tips[9]='Use the invite tool located in the toolbox to share boards among friends.'
tips[10]='Use the invite tool located in the toolbox to share boards among friends.'



$('#tip_of_the_day_list').text(tips[Math.floor(Math.random()*10)])
});
