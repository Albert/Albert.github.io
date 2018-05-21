define(['lodash', 'p5', 'player', 'jquery'], function(_, p5, player, $) {
  var exports = {};

  var myp5 = new p5(function( p5 ) {


var youTubePlayer;
var videoId = 'ruAi4VBoBSM';

$('#videoThumb').css('background-image', 'url("https://img.youtube.com/vi/' + videoId + '/mqdefault.jpg")');
$('#videoThumb').click(function() {
  youTubePlayer.playVideo();
  $('#videoThumb').hide();
});

player.makePlayer(document.getElementById('video'), videoId, function(p) {
  youTubePlayer = p;
});

var choreoTape = {
  addTap: function(keyVal) {
    this.taps = choreoTape.taps || [];
    this.taps.push({key: keyVal, songTime: youTubePlayer.getCurrentTime()});
  }
};

var recordingMachine = {
  startRecording: function() {
    this.isRecording = true;
    youTubePlayer.playVideo();
  },
  stopRecording: function() {
    this.isRecording = false;
    youTubePlayer.pauseVideo();
  }
};

var playbackMachine = {
  keyPositions: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'],
  startPlayback: function() {
    this.isPlaying = true;
    youTubePlayer.playVideo();
  },
  loadChoreo: function(choreoTape) {
    this.taps = [];
    for (var i = 0; i < choreoTape.taps.length; i++ ) {
      this.taps.push(new PlaybackTap(choreoTape.taps[i]));
    }
  }
};


function PlaybackTap(tapData) {
  this.keyVal = tapData.key;
  this.songTime = tapData.songTime;
  this.xPosition = 50 + playbackMachine.keyPositions.indexOf(this.keyVal) * p5.width / 8;
  this.draw = function() {
    var timeUntilTap = this.songTime - youTubePlayer.getCurrentTime();
    var y = p5.map(timeUntilTap, 1, 0, 0, p5.height);
    p5.fill(255);
    p5.rect(this.xPosition, y, 50, 50);
    p5.textSize(64);
    p5.textAlign(p5.CENTER);
    p5.fill(0);
    p5.text(this.keyVal.toUpperCase(), this.xPosition, y + 25);
  }
}

p5.setup = function() {
  p5.createCanvas(800, 480);
  p5.rectMode(p5.RADIUS);
};

p5.draw = function() {
  p5.background(0);

  if (playbackMachine.isPlaying) {
    _.forEach(playbackMachine.taps, function(t) {
      t.draw();
      if (youTubePlayer.getCurrentTime() > t.songTime) {
        t.toDelete = true;
      }
    });
    playbackMachine.taps = _.filter(playbackMachine.taps, function(t) {return !t.toDelete});
  }
};
/*

keys:

1 start recording
2 stop recording
3 console.log data
4 playback


[a/s/d/f/g/h/j/k] 

*/


p5.keyTyped = function() {
  var acceptableTaps = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];
  if (acceptableTaps.indexOf(p5.key) != -1) {
    choreoTape.addTap(p5.key);
  }
  if (p5.key == '1') {
    recordingMachine.startRecording();
    $('#videoThumb').hide();
  }
  if (p5.key == '2') {
    recordingMachine.stopRecording();
    youTubePlayer.seekTo(0);
  }
  if (p5.key == '3') {
    console.log(JSON.stringify(choreoTape.taps));
  }
  if (p5.key == '4') {
    playbackMachine.loadChoreo(choreoTape);
    playbackMachine.startPlayback();
  }

  if (p5.key == 'p') {
    if (youTubePlayer.getPlayerState() == 1) {
      youTubePlayer.pauseVideo();
    } else {
      youTubePlayer.playVideo();
    }
  }
  return false;
}


exports.choreoTape = choreoTape;

  });

  return exports;
});
