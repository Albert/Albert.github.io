define(['lodash', 'p5', 'player', 'jquery', 'p5.sound'], function(_, p5, player, $) {
  var exports = {};

  var myp5 = new p5(function( sk ) {

var tambourine;
sk.preload = function() {
  tambourine = sk.loadSound('assets/tambourine.mp3');
  tambourine.setVolume(0.1);
}

var youTubePlayer;
var videoId = 'E5yFcdPAGv0';

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
    var timeSinceHit = sk.millis() - this.time;
    if (timeSinceHit > ttl) {
      this.expired = true;
    }
    var rad = sk.map(timeSinceHit, 0, ttl, 0, sk.width);
    sk.push();
      sk.fill(0);
      sk.stroke(sk.map(timeSinceHit, 0, ttl, 0, 255), 255, 255);
      sk.strokeWeight(sk.map(timeSinceHit, 0, ttl, 20, 0));
      sk.ellipse((this.keyIdx + 0.5) * (sk.width / 8), sk.height, rad, rad);
    sk.pop();
  }
}

var playbackMachine = {
  keyPositions: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
  startPlayback: function() {
    this.isPlaying = true;
    youTubePlayer.playVideo();
  },
  loadChoreo: function(choreoTape) {
    choreoTape.taps = choreoTape.taps || [];
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
  this.xPosition = 50 + playbackMachine.keyPositions.indexOf(this.keyVal) * sk.width / 8;
  this.draw = function() {
    var timeUntilTap = this.songTime - youTubePlayer.getCurrentTime();
    var y = sk.map(timeUntilTap, 1, 0, 0, sk.height);
    sk.push();
      sk.fill(255);
      sk.rect(this.xPosition, y, 50, 50);
      sk.textSize(64);
      sk.textAlign(sk.CENTER);
      sk.fill(0);
      sk.text(this.keyVal.toUpperCase(), this.xPosition, y + 25);
    sk.pop();
  }
}

sk.setup = function() {
  sk.createCanvas(800, 480);
  sk.rectMode(sk.RADIUS);
  sk.ellipseMode(sk.RADIUS);
  sk.colorMode(sk.HSB);
};

sk.draw = function() {
  sk.background(0);
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


sk.keyTyped = function() {
  var acceptableTaps = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
  if (acceptableTaps.indexOf(sk.key) != -1) {
    tambourine.play();
    if (recordingMachine.isRecording) {
      choreoTape.addTap(sk.key);
    }
    if (playbackMachine.isPlaying) {
      var closest = _.minBy(playbackMachine.taps, function(tap){
        if (tap.keyVal != sk.key) {
          return 99999;
        }
        return Math.abs(tap.songTime - youTubePlayer.getCurrentTime());
      });
      if (Math.abs(closest.songTime - youTubePlayer.getCurrentTime()) < 0.1) {
        closest.toDelete = true;
        playbackMachine.addHit();
      }
    }
    graphicalFeedback.tapRings.push(new tapRing(acceptableTaps.indexOf(sk.key), sk.millis()));
  }
  if (sk.key == '1') {
    recordingMachine.startRecording();
    $('#videoThumb').hide();
  }
  if (sk.key == '2') {
    recordingMachine.stopRecording();
    youTubePlayer.seekTo(0);
  }
  if (sk.key == '3') {
    console.log(JSON.stringify(choreoTape.taps));
  }

  if (sk.key == 'p') {
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
