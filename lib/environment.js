// Client-to-client messaging using Meteor Streams
ChatStream = new Meteor.Stream('chat');

Robots = new Meteor.Collection('robots');

if (Meteor.isServer && Robots.find().count() == 0) {
  console.log('Inserting may and june robots');
  // Insert these records once on the server
  var robots = [{name: 'may'}, {name: 'june'}];
  for (var i=0; i<robots.length; i++) {
    var robot = robots[i];
    Robots.insert(robot);

    // Create an account for it if necessary
    Accounts.createUser({username: robot.name, password: robot.name, profile: {robot: true}});
  }
}

