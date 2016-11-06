console.log('Chat starting');

var socket = io.connect();

socket.on("chat", function(data) {
    console.log(
        "socket.on('chat')",
        data
    );

    $('.form__chat').prepend('<div class="form__chat__enttry">' + data.name + ': ' + data.text + '</div>');

    navigator.vibrate(10);
});

$('.form__send').on("click", send);

function send() {
    console.log('send()');

    var user = navigator.platform,
        name = $('.form__name').val(),
        text = $('.form__message').val();

    console.log(name, text);

    socket.emit("chat", { name: user + ' ' + name, text: text });

    $('.form__name, .form__message').val('');
}
