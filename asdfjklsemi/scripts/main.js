define(['lodash', 'p5', 'player', 'jquery', 'firebase', 'p5.sound'], function(_, p5, player, $, firebase) {

  var exports = {};

  var myp5 = new p5(function( sk ) {

    var sketchWidth = 800;
    var sketchHeight = 480;

$('#mobileReminder').attr('href', "mailto:?subject=Reminder: try asdfjklsemi&body=Sadly, asdfjklsemi supports only desktop browsers.  To remind you to try this later, send yourself this email.%0D%0A%0D%0A" + encodeURIComponent(document.location.href));

sk.setup = function() {
  sk.createCanvas(sketchWidth, sketchHeight);
  sk.rectMode(sk.RADIUS);
  sk.ellipseMode(sk.RADIUS);
  sk.colorMode(sk.HSB);
};

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function param(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

var tambourine;
var trombone;
sk.preload = function() {
  tambourine = sk.loadSound('assets/tambourine.mp3');
  tambourine.setVolume(0.1);
  trombone = sk.loadSound('assets/error.wav');
  trombone.setVolume(0.15);
}

var firebaseConfig = {
  authDomain: "asdf-jklsemi-io.firebaseapp.com",
  databaseURL: "https://asdf-jklsemi-io.firebaseio.com",
  storageBucket: "bucket.appspot.com"
};
firebase.initializeApp(firebaseConfig);

var db = firebase.database();

var youTubePlayer;
$('#videoThumb').click(function() {
  youTubePlayer.playVideo();
  $('#videoThumb').hide();
});

// update link to tutorial - currently it naively assumes url has a '?':
var currHref = document.location.href;
var newHref = currHref.replace('tutorial=0', '');
newHref = newHref + '&tutorial=1';
$('#btnTutorial').attr('href', newHref);

$('#btnPlayGame, #btnPlayTutorial').click(function() {
  $('#coverageModal').hide();
  playbackMachine.startPlayback();
  db.ref('choreos/' + param('choreo') + '/timesLoaded').transaction(function(timesLoaded) {
    return timesLoaded + 1;
  });
});

$('#recorderButton').click(function() {
  var $this = $(this);
  if ($this.hasClass('record')) {
    recordingMachine.startRecording();
    $('#videoThumb').hide();
    $this.html('Save Choreo').addClass('save').removeClass('record');
  } else if ($this.hasClass('save')) {
    $this.hide();
    recordingMachine.stopRecording();
    youTubePlayer.seekTo(0);
    var randomKey = Math.floor(Math.random() * 99999999999999999)
    db.ref('choreos/' + randomKey).set({
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      choreographer: param('choreographer'),
      choreography: choreoTape.taps,
      youtubeID: param('v'),
      timesLoaded: 0
    }).then(function() {
      var playUrl = location.protocol + '//' + location.host + location.pathname + '?v=' + param('v') + '&choreo=' + randomKey;
      if (confirm('Choreography recorded!  Try it out:')) {
        window.location.href = playUrl;
      }
      $('#playUrl').html('<a href="' + playUrl + '">Try it here</a>');
    })

  }
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
  },
  drawKeys: function() {
    for (var i = 0; i < playbackMachine.keyPositions.length; i++) {
      var key = playbackMachine.keyPositions[i];
      var xPos = 50 + i * sketchWidth / 8;
      sk.push();
        sk.fill(0, 0, 0, 0);
        sk.stroke(255);
        sk.rect(xPos, sk.height - 50, 40, 40);
        sk.textSize(64);
        sk.textAlign(sk.CENTER);
        sk.fill(0);
        sk.text(key.toUpperCase(), xPos, sk.height - 25);
      sk.pop();
    }
  },
  failures: [],
  addFailure: function(tap) {
    this.failures.push({'position': tap.xPosition, 'time':sk.millis()});
  },
  drawFailures: function() {
    for (var i = 0; i < this.failures.length; i++) {
      var f = this.failures[i];
      var timeElapsed = sk.millis() - f.time;
      if (timeElapsed < 500) {
        sk.push();
          sk.colorMode(sk.RGB);
          sk.fill(127, 0, 0, sk.map(sk.millis() - f.time, 0, 500, 255, 0));
          sk.stroke(255, 0, 0, sk.map(sk.millis() - f.time, 0, 500, 255, 0));
          sk.rect(f.position, sk.height/2, 50, sk.height);
        sk.pop();
      } else {
        this.failures[i].toDelete = true;
      }
    }
    this.failures = _.filter(this.failures, function(f) {return !f.toDelete});
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
    var rad = sk.map(timeSinceHit, 0, ttl, 0, sketchWidth);
    sk.push();
      sk.fill(0);
      sk.stroke(sk.map(timeSinceHit, 0, ttl, 0, 255), 255, 255);
      sk.strokeWeight(sk.map(timeSinceHit, 0, ttl, 20, 0));
      sk.ellipse((this.keyIdx + 0.5) * (sketchWidth / 8), sk.height - 50, rad, rad);
    sk.pop();
    sk.push();
      sk.colorMode(sk.RGB);
      sk.fill(255, 255, 255, sk.map(timeSinceHit, 0, ttl/6, 255, 0));
      sk.rect((this.keyIdx + 0.5) * (sketchWidth / 8), sk.height - 50, 40, 40);
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
    $('#sidePanel').addClass('choreoLoaded');
    $('.loader').hide();
    var tutorialState = (param('tutorial') == '1') ? 'tutorial' : 'game';
    $('.toLoad').addClass(tutorialState).show();
    this.updateScore();
  },
  hits: 0,
  misses: 0,
  score: 0,
  addHit: function() {
    this.hits ++;
    this.updateScore();
  },
  addMiss: function(t) {
    t.toDelete = true;
    trombone.play();
    graphicalFeedback.addFailure(t)
    this.misses ++;
    this.updateScore();
  },
  updateScore: function() {
    this.score = this.hits * 100 - this.misses * 10;
    $('#score').html(this.score);
    var tweetUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(document.location.href) + '&text=' + encodeURI('I just got a score of ' + this.score + ' on this YouTube keyboard rhythm game.  Can you do better?  ');
    $('#tweetScore').attr('href', tweetUrl).html('Share your score on Twitter');
  }
};


function PlaybackTap(tapData) {
  this.keyVal = tapData.key;
  this.songTime = tapData.songTime;
  this.xPosition = 50 + playbackMachine.keyPositions.indexOf(this.keyVal) * sketchWidth / 8;
  this.draw = function() {
    var timeUntilTap = this.songTime - youTubePlayer.getCurrentTime();
    if (timeUntilTap > 5) {
      return false;
    }
    var y = sk.map(timeUntilTap, 1, 0, 0, sk.height) - 50;
    sk.push();
      sk.fill(255);
      sk.rect(this.xPosition, y, 40, 40);
      sk.textSize(64);
      sk.textAlign(sk.CENTER);
      sk.fill(0);
      sk.text(this.keyVal.toUpperCase(), this.xPosition, y + 25);
    sk.pop();
  }
}

sk.mousePressed = function() {
  if (sk.mouseY < sk.height && sk.mouseY > sk.height - 100) {
    addATapByI(Math.floor(sk.mouseX / 100));
  }
}

sk.draw = function() {
  sk.background(0);
  for (var i = 0; i < graphicalFeedback.tapRings.length; i++) {
    graphicalFeedback.tapRings[i].draw();
  }
  graphicalFeedback.flushTapRings();

  if (playbackMachine.isPlaying) {
    graphicalFeedback.drawFailures();
    _.forEach(playbackMachine.taps, function(t) {
      t.draw();
      if (youTubePlayer.getCurrentTime() > t.songTime + .5) {
        playbackMachine.addMiss(t);
      }
    });
    playbackMachine.taps = _.filter(playbackMachine.taps, function(t) {return !t.toDelete});
  }

  graphicalFeedback.drawKeys();
};
/*

keys:

1 start recording
2 stop recording
3 console.log data
4 playback


[a/s/d/f/g/h/j/k] 

*/

function addATapByI(i) {
  addATap(['a', 's', 'd', 'f', 'j', 'k', 'l', ';'][i]);
}

function addATap(key) {
  var acceptableTaps = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
  if (acceptableTaps.indexOf(key) == -1) { return; }
  tambourine.play();
  if (recordingMachine.isRecording) {
    choreoTape.addTap(key);
  }
  if (playbackMachine.isPlaying) {
    var closest = _.minBy(playbackMachine.taps, function(tap){
      if (tap.keyVal != key) {
        return 99999;
      }
      return Math.abs(tap.songTime - youTubePlayer.getCurrentTime());
    });
    if (Math.abs(closest.songTime - youTubePlayer.getCurrentTime()) < 0.1) {
      closest.toDelete = true;
      playbackMachine.addHit();
    }
  }
  graphicalFeedback.tapRings.push(new tapRing(acceptableTaps.indexOf(key), sk.millis()));
}

sk.keyTyped = function() {
  addATap(sk.key);
  return false;
}

player.makePlayer(document.getElementById('video'), param('v'), function(p) {
  youTubePlayer = p;
});
$('#videoThumb').css('background-image', 'url("https://img.youtube.com/vi/' + param('v') + '/mqdefault.jpg")');


if (param('choreo') == 'new') {
  $('#sidePanel').addClass('recordMode');
} else {
  db.ref('choreos/' + param('choreo')).once('value').then(function(snapshot) {
    choreoTape.taps = snapshot.val().choreography;
    $('#choreographer').html(snapshot.val().choreographer);
    $('#playCount').html(snapshot.val().timesLoaded);
    playbackMachine.loadChoreo(choreoTape);

    if (param('v') != snapshot.val().youtubeID) {
      alert('error, invalid URL')
    }
  });
}

exports.choreoTape = choreoTape;
exports.playbackMachine = playbackMachine;

  });

  return exports;
});
