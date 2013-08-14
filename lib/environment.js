// Client-to-client messaging using Meteor Streams
ChatStream = new Meteor.Stream('chat');

Robots = new Meteor.Collection('robots');

if (Meteor.isServer) {
  // Insert these records once on the server
  var robots = [{name: 'may'}, {name: 'june'}];
  for (var i=0; i<robots.length; i++) {
    var robot = robots[i];

    // Create an account for it if necessary
    if (!Meteor.users.findOne({username: robot.name})) {
      console.log('Inserting robot', robot.name);
      Accounts.createUser({username: robot.name, password: robot.name, profile: {robot: true}});
    }
  }
}

