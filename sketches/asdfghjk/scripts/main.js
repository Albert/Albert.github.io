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
$('#playGame').click(function() {
  playbackMachine.startPlayback();
  $(this).hide();
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

var graphicalFeedback = {
  tapRings: [],
  flushTapRings: function() {
    this.tapRings = _.filter(this.tapRings, function(t) { return t.expired == undefined; });
  }
};

function tapRing(keyIdx, time) {
  this.keyIdx = keyIdx;
  this.time = time;
  this.draw = function() {
    var ttl = 2000;
    var timeSinceHit = p5.millis() - this.time;
    if (timeSinceHit > ttl) {
      this.expired = true;
    }
    var rad = p5.map(timeSinceHit, 0, ttl, 0, p5.width);
    p5.push();
      p5.fill(0);
      p5.stroke(p5.map(timeSinceHit, 0, ttl, 0, 255), 255, 255);
      p5.strokeWeight(p5.map(timeSinceHit, 0, ttl, 20, 0));
      p5.ellipse((this.keyIdx + 0.5) * (p5.width / 8), p5.height, rad, rad);
    p5.pop();
  }
}

var playbackMachine = {
  keyPositions: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
  startPlayback: function() {
    this.isPlaying = true;
    youTubePlayer.playVideo();
  },
  loadChoreo: function(choreoTape) {
    this.taps = [];
    for (var i = 0; i < choreoTape.taps.length; i++ ) {
      var t = new PlaybackTap(choreoTape.taps[i]);
      this.taps.push(t);
    }
    $('#playGame').removeClass('loading').html('Play');
  },
  hits: 0,
  misses: 0,
  addHit: function() {
    this.hits ++;
    $('#hits').html(this.hits);
  },
  addMiss: function() {
    this.misses ++;
    $('#misses').html(this.misses);
  }
};


function PlaybackTap(tapData) {
  this.keyVal = tapData.key;
  this.songTime = tapData.songTime;
  this.xPosition = 50 + playbackMachine.keyPositions.indexOf(this.keyVal) * p5.width / 8;
  this.draw = function() {
    var timeUntilTap = this.songTime - youTubePlayer.getCurrentTime();
    var y = p5.map(timeUntilTap, 1, 0, 0, p5.height);
    p5.push();
      p5.fill(255);
      p5.rect(this.xPosition, y, 50, 50);
      p5.textSize(64);
      p5.textAlign(p5.CENTER);
      p5.fill(0);
      p5.text(this.keyVal.toUpperCase(), this.xPosition, y + 25);
    p5.pop();
  }
}

p5.setup = function() {
  p5.createCanvas(800, 480);
  p5.rectMode(p5.RADIUS);
  p5.ellipseMode(p5.RADIUS);
  p5.colorMode(p5.HSB);
};

p5.draw = function() {
  p5.background(0);
  for (var i = 0; i < graphicalFeedback.tapRings.length; i++) {
    graphicalFeedback.tapRings[i].draw();
  }
  graphicalFeedback.flushTapRings();

  if (playbackMachine.isPlaying) {
    _.forEach(playbackMachine.taps, function(t) {
      t.draw();
      if (youTubePlayer.getCurrentTime() > t.songTime + .5) {
        t.toDelete = true;
        playbackMachine.addMiss();
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
  var acceptableTaps = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
  if (acceptableTaps.indexOf(p5.key) != -1) {
    if (recordingMachine.isRecording) {
      choreoTape.addTap(p5.key);
    }
    if (playbackMachine.isPlaying) {
      var closest = _.minBy(playbackMachine.taps, function(tap){
        if (tap.keyVal != p5.key) {
          return 99999;
        }
        return Math.abs(tap.songTime - youTubePlayer.getCurrentTime());
      });
      if (Math.abs(closest.songTime - youTubePlayer.getCurrentTime()) < 0.5) {
        closest.toDelete = true;
        playbackMachine.addHit();
      }
    }
    graphicalFeedback.tapRings.push(new tapRing(acceptableTaps.indexOf(p5.key), p5.millis()));
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
exports.playbackMachine = playbackMachine;

  });

  return exports;
});
