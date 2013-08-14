/* We don't need this because we have autopublish turned on */
Meteor.publish('users', function() {
  return Meteor.users.find({profile: {robot: {$ne: true}}});
});

Meteor.publish('userPresence', function() {
  // For now we'll just publish presence on everyone who's ever logged in
  var filter = {};
  return Meteor.presences.find(filter, {fields: {state: true, userId: true}});
});

Meteor.publish('robots', function() {
  return Robots.find();
});

