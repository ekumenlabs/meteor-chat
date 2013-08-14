/* We don't need this because we have autopublish turned on */
Meteor.publish('users', function() {
  return Meteor.users.find({});
});

Meteor.publish('userPresence', function() {
  // For now we'll just publish presence on everyone who's ever logged in
  var filter = {};
  return Meteor.presences.find(filter, {fields: {state: true, userId: true}});
});

// This doesn't work, don't use it
Meteor.publish('robots', function() {
  var ret = Meteor.users.find({'profile.robot': true});
  return ret;
});
