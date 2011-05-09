window.channel.bind('note-created', function(data) {
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