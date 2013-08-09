// subscribe to these collections
Meteor.subscribe('users');
Meteor.subscribe('userPresence');

Session.set('selected_user', null);

ChatStream.on('message', function(data) {
  // TODO: move this filtering to the server
  if (data.to != Meteor.userId()) {
    console.log('Ignoring msg to', data.to, 'I am', Meteor.userId());
  }

  var from = Meteor.users.findOne(data.from);
  console.log(getEmail(from), 'sent', data.text);
});

