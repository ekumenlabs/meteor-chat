window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;


// Initialization
this.pc = null;


// Helper functions
function onFailSoHard(err) {
  console.log('Error initializing video:', err);
}

// ----------------------------------------------------------------------
// Initialize a WebRTC connection

startVideoChat = function(target, amCaller) {
  console.log('Starting video with', getEmail(target));

  if (hasGetUserMedia()) {
    // Good to go!
  } else {
    alert('getUserMedia() is not supported in your browser');
    return;
  }

  var config = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
  this.pc = new webkitRTCPeerConnection(config);
  this.pc.onicecandidate = function(evt) {
//    console.log('Found candidate:', evt.candidate);
    if (evt.candidate) {
      sendChatMessage(target, {'candidate': evt.candidate});
    }
  };

  this.pc.onaddstream = function(evt) {
    var theirVideo = document.querySelector('#theirVideo');
    // this might need to be window.URL.createObjectURL
    theirVideo.src = URL.createObjectURL(evt.stream);
    console.log('Displaying their video in the stream:', evt.stream);
  };

  // Get our local video stream and send it
  navigator.getUserMedia({audio: true, video: true}, function(stream) {
    // Save a copy of the stream so we can stop it when the user is done
    this.localMediaStream = stream;

    this.pc.addStream(stream);

    if (amCaller) {
      // If we're the caller
      this.pc.createOffer(gotDescription);
    } else {
      console.log('Creating answer for remote caller', this.pc.remoteDescription);
      this.pc.createAnswer(gotDescription);
    }

    function gotDescription(desc) {
      this.pc.setLocalDescription(desc);
      sendChatMessage(target, {'sdp': desc});
    }

    // Display my video in the UI
    var video = document.querySelector('#myVideo');
    console.log('Displaying my own video in the UI:', stream);
    video.src = window.URL.createObjectURL(stream);
  }, onFailSoHard);
};

// ----------------------------------------------------------------------
// Tear down the WebRTC connection

endVideoChat = function(callee) {
  this.localMediaStream.stop();
};

// ----------------------------------------------------------------------
// Client-to-client messaging
// These use the Meteor.Stream created in ../lib/environment.js

sendChatMessage = function(target, data) {
  var pkt = {from: Meteor.userId(), to: target, msg: data};
  ChatStream.emit('message', pkt);
//  console.log('Sending:', pkt);
};

receiveChatMessage = function(data) {
//  console.log('Receiving:', data);
  var from = data.from;
  var to = data.to;
  var msg = data.msg;

  if (!this.pc) {
    // I am receiving a call
    startVideoChat(from, false);
  }

  if (msg.sdp) {
//    console.log('Message contains an SDP');
    this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
  } else if (msg.candidate) {
//    console.log('Message contains a candidate:', msg.candidate);
    this.pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
  } else if (msg.endchat) {
    endVideoChat();
  } else {
    console.log('UNKNOWN message received:', msg);
  }
}

ChatStream.on('message', function(data) {
  // TODO: move this filtering to the server
  if (data.to != Meteor.userId()) {
    // Ignore all messages not sent to me
    return;
  }

  receiveChatMessage(data);

  var from = Meteor.users.findOne(data.from);
//  console.log(getEmail(from), 'sent', data.msg);
});

