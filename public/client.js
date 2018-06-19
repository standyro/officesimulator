
  var socket = io();
  $(function () {

    $(document).keydown(function(e){
      console.log('keydown')
      socket.emit('keycode', e.keyCode);
      if (e.keyCode == 37) {
         console.log("left pressed");
      }
    });

    $('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
  });
