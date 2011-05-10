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

$( function(){ 
	window.fayeHandler.bind("field-split",split_field_callback);
	window.fayeHandler.bind("field-resize", update_fields);
	window.fayeHandler.bind('note-created', function(data) {
		create_note_at_dom(data.note, $('#field_' + data.note.note.field_id), window.current_user == data.user);
	    });
	window.fayeHandler.bind('note-destroyed', function(data){
		delete_note(data.note.id);
	    });
	window.fayeHandler.bind('note-update', function(data){
		update_note(data);
	    });
	window.fayeHandler.bind('field-merge', merge_field_callback);
    }
    );

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
	if (!(action in callbacks)) {
	    window.console.error("No callback registered for action: " + action);
	}
      _.each(callbacks[action], function(callback){
	      callback.call(null, data);
      });
    };
    
    //var client = new Faye.Client('http://localhost:9292/faye');
    window.faye.subscribe('/board/' +  window.current_board, function(message){
      onAction(message.action, message.data);
    });  
  };
  
  window.fayeHandler = new FayHandler();
})();