// subscribe to these collections
Meteor.subscribe('users');
Meteor.subscribe('userPresence');

Session.set('selected_user', null);


