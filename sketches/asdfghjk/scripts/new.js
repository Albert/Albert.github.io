define(['jquery'], function($) {

  $('#newChoreoForm').submit(function(event) {
    window.location.href = './index.html?choreo=new&v=' + youtube_parser($('input#v').val()) + '&choreographer=' + $('input#choreographer').val();
    event.preventDefault();
  });

  //https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
  function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

  function param(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

});
