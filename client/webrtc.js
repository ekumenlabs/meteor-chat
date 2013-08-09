window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

function onFailSoHard(err) {
  console.log('Error initializing video:', err);
}

startVideoChat = function(target) {
  console.log('Starting video with', getEmail(target));
  sendChatMessage({text: 'I want to start a chat with you', from: Meteor.userId(), to: target});

  if (hasGetUserMedia()) {
    // Good to go!
  } else {
    alert('getUserMedia() is not supported in your browser');
    return;
  }

  var video = document.querySelector('#myVideo');
  console.log('Video element is', video);

  navigator.getUserMedia({audio: true, video: true}, function(stream) {
    this.localMediaStream = stream;
    var objectURL = window.URL.createObjectURL(stream);
    video.src = objectURL;
    console.log('setting src to', objectURL, video);

  }, onFailSoHard);
};

endVideoChat = function() {
  this.localMediaStream.stop();
};
