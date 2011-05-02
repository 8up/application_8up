$(document).ready(function () {  
  //börja med att köra funktionen en gång
  update_online_list();
  // Kör den sen med jämt intervall
  setInterval(update_online_list, 100000);
});

function update_online_list(){
  var user_list = $("#online_user_list");
  $.ajax({
    url: '/online_users.json',
    type: 'GET',
    success: function(users, textStatus, jqXHR){
      // Först tömmer vi user_list-div:en
      user_list.empty();

      //Sortera users efter deras namn
      users.sort( function(a, b)  {
        var name_a = a.user.name.toLowerCase();
        var name_b = b.user.name.toLowerCase();
        if (name_a < name_b) {
          return -1;
        }
        else if (name_a > name_b) {
          return 1;
        } 
        return 0;
      });

      //Lägg till namnen i användar-listan
      for(var i = 0; i < users.length; i++){
        user_list.append(users[i].user.name + "<br/>");
      }
    }
  });
};