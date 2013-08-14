// Initialize state variables
Session.set('myVideoSrc', '');
Session.set('inVideoChat', false);
Session.set('selectedRobot', null);
Session.set('selectedUser', null);

// Router
Meteor.Router.add({
  '/': 'main',
  '/tablet': 'tablet'
});

Template.users.users = function() {
  return Meteor.users.find().fetch();
};

Template.users.videoDisabled = function() {
  var selected = Session.get('selected_user');
  if (selected && isOnline(selected) && !Session.equals('selected_user', Meteor.userId())) {
    return "active";
  } else {
    return "disabled";
  }
};

Template.users.selectedUser = function() {
  var selected = Session.get('selected_user');
  return (selected && isOnline(selected) && !Session.equals('selected_user', Meteor.userId()));
};

Template.users.events({
  'mouseup .user': function() {
    if (Session.equals('selected_user', this._id)) {
      Session.set('selected_user', null);
    } else {
      Session.set('selected_user', this._id);
    }
  },

  'mouseup #startVideo': function() {
    var tag = $('#startVideo');
    // Ignore clicks if we are disabled
    if (tag.hasClass('disabled')) return;
    startVideoChat(Session.get('selected_user'), true);
  },
});

Template.video.inVideoChat = function() {
  return Session.get('inVideoChat') ? 'videochat-show' : 'videochat-hide';
};

Template.video.events({
  'mouseup #endVideo': function() {
    endVideoChat();
    console.log('setting inVideoChat to false');
    Session.set('inVideoChat', false);
  }
});

Template.video.myVideoSrc = function() {
  console.log('Returning myVideoSrc:', Session.get('myVideoSrc'));
  return Session.get('myVideoSrc');
};

Template.user.icon = function() {
  return getIcon(this, 64);
};

Template.user.friendlyname = function() {
  return getFriendlyName(this);
};

Template.user.status = function() {
  var presence = Meteor.presences.findOne({userId: this._id});
  if (presence) {
    return presence.state;
  } else {
    return 'offline';
  }
};

Template.user.selected = function() {
  return Session.equals('selected_user', this._id) ? 'selected' : '';
};

Template.user.online = function() {
  return isOnline(this._id);
};

/* ---------------------------------------------------------------------- */
// Selecting a robot

Template.navbar.selectedRobot = function() {
  return Session.get('selectedRobot');
};

Template.navbar.events({
  'mouseup .logout': function() {
    Session.set('selectedRobot', null);
    Meteor.logout();
  }
});

Template.tabletChoose.robots = function() {
  return Robots.find().fetch();
};

Template.tabletChoose.selectedRobot = function() {
  return Session.get('selectedRobot');
};

Template.robot.events({
  'mouseup': function() {
    Session.set('selectedRobot', this.name);
    Meteor.loginWithPassword(this.name, this.name);
  },
});

/* Workaround because Meteor causes autoplay not to work.
   See http://stackoverflow.com/questions/13851118/audio-file-does-not-autoplay-within-template */
Template.robotVideo.rendered = function() {
  var eyes = document.querySelector('.eyes');
  eyes.play();
};

Template.robotVideo.inVideoChat = function() {
  return Session.get('inVideoChat');
};
Template.robotVideo.notInVideoChat = function() {
  return !Session.get('inVideoChat');
};

Template.main.userIsNotRobot = function() {
  var user = Meteor.user();
  return (user && !user.profile.robot);
};
