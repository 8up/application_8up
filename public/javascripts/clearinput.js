/*
jQuery Clear-Input plugin
v1.0
Author: Aidan Feldman

USAGE
Add the class .clear-input to any text input element
whose value you want cleared when it gains focus.
The initial value will be replaced when the input
loses focus, and no new text has been entered.

If you prefer to not add classes to your elements,
you can alternatively call clearInput() on any jQuery
input object.
*/
(function( $ ){
  // define the initialValue() function
  $.fn.initialValue = function(value) {
    if (value) {
      return this.attr('initial-value', value);
    } else {
      return this.attr('initial-value');
    }
  };
  
  $.fn.clearInput = function() {
    return this
      .focus(function(){
        if (this.value == $(this).initialValue()) {
          this.value = '';
        }
      })
      .blur(function(){
        if (this.value == '') {
          this.value = $(this).initialValue();
        }
      })
      .each(function(index, elt) {
        $(this).initialValue(this.value);
      });
  };

  // apply plugin to all inputs with class ".clear-input"
  $(function() {
    $('input.clear-input').clearInput();
  });
})( jQuery );