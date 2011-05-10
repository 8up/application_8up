/*window.channel.bind('note-created', function(data) {
  create_note_at_dom(data.note, $('#field_' + data.note.note.field_id), window.current_user == data.user);
});
window.channel.bind('note-destroyed', function(data){
  delete_note(data.note.id);
});
window.channel.bind('note-updated', function(data){
  update_note(data);
});
window.channel.bind('resize-field', function(data){
  update_fields(data);
});
window.channel.bind('merge-field', merge_field_callback);*/

(function(){
  var FayHandler = function(adress){
    
    var callbacks = {};
    this.bind = function(action, functionCallback){
      var currentCallbacks = callbacks[action];
      if(currentCallbacks == undefined){
        callbacks[action] = [];
      }
      callbacks[action].push(functionCallback);
    };
    
    var onAction = function(action, data){
      _.each(callbacks[action], function(callback){
        callback.call(data);
      });
    };
    
    //var client = new Faye.Client('http://localhost:9292/faye');
    window.channel.subscribe('/board/' +  window.current_board, function(message){
      onAction(message.action, message.data);
    });  
  };
  
  window.fayeHandler = new FayHandler();
})();