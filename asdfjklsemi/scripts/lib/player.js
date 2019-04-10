define(['jquery'], function($) {
  var player = {

    makePlayer: function(container, videoId, callback) {
      if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
        window.onYouTubeIframeAPIReady = function() {
          var p = player.loadPlayer(container, videoId);
          callback(p);
        };

        $.getScript('//www.youtube.com/iframe_api');
      } else {
        var p = player.loadPlayer(container, videoId);
        callback(p);
      }
    },

    loadPlayer: function(container, videoId) {
      return new YT.Player(container, {
        videoId: videoId,
        width: 200,
        height: 200,
        events: {
          'onReady': function() {
            $('body').addClass('videoLoaded');
          }
        },
        // For a list of all parameters, see:
        // https://developers.google.com/youtube/player_parameters
        playerVars: {
          disablekb: 1,
          //controls: 0,
          modestbranding: 1,
          origin: '',
          rel: 0,
          showinfo: 0,
          autoHide: 1,
          widget_referrer: 'TODO, place in domain'
        }
      });
    }
  };

  return player;
});
