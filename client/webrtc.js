startVideoChat = function() {
  var target = Session.get('selected_user');
  console.log('Starting video with', getEmail(target));
  sendChatMessage({text: 'I want to start a chat with you', from: Meteor.userId(), to: target});

  if (hasGetUserMedia()) {
    // Good to go!
    Session.set('has_get_user_media', true);
  } else {
    alert('getUserMedia() is not supported in your browser');
    Session.set('has_get_user_media', false);
    return;
  }
};


