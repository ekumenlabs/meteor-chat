// subscribe to these collections
Meteor.subscribe('users');
Meteor.subscribe('userPresence');
Meteor.subscribe('robots');

Session.set('selected_user', null);


