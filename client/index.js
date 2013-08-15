// Initialize state variables
Session.set('myVideoSrc', '');
Session.set('inVideoChat', false);
Session.set('chattingWith', null);
Session.set('selectedRobot', null);
Session.set('selectedUser', null);

// Router
Meteor.Router.add({
  '/': 'main',
  '/tablet': 'tablet'
});

/* ---------------------------------------------------------------------- */
// List of robots

Template.robotList.robots = function() {
  return Meteor.users.find({"profile.robot": true}).fetch();
};

Template.robotList.videoDisabled = function() {
  var selected = Session.get('selected_user');
  if (selected && isOnline(selected) && !Session.equals('selected_user', Meteor.userId())) {
    return "active";
  } else {
    return "disabled";
  }
};

Template.robotList.selectedUser = function() {
  var selected = Session.get('selected_user');
  return (selected && isOnline(selected) && !Session.equals('selected_user', Meteor.userId()));
};

Template.robotList.events({
  'mouseup .robot': function() {
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

/* ---------------------------------------------------------------------- */
// Video template

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

Template.robot.icon = function() {
  return getIcon(this, 64);
};

Template.robot.friendlyname = function() {
  return getFriendlyName(this);
};

Template.robot.status = function() {
  var presence = Meteor.presences.findOne({userId: this._id});
  if (presence) {
    return presence.state;
  } else {
    return 'offline';
  }
};

Template.robot.selected = function() {
  return Session.equals('selected_user', this._id) ? 'selected' : '';
};

Template.robot.online = function() {
  return isOnline(this._id);
};

/* ---------------------------------------------------------------------- */
// Selecting a robot

Template.navbar.title = function() {
  if (Session.get('inVideoChat') && Session.get('chattingWith')) {
    var user = Meteor.users.findOne(Session.get('chattingWith'));
    if (iAmRobot()) {
      return 'Teleoperated by ' + getFriendlyName(user);
    } else {
      return 'Teleoperating ' + getFriendlyName(user);
    }
  }
  return "Telepresence";
};

Template.navbar.loggedInAsRobot = function() {
  var user = Meteor.user();
  return (user && user.profile.robot);
};

Template.navbar.events({
  'mouseup .logout': function() {
    Session.set('selectedRobot', null);
    Meteor.logout();
  }
});

Template.robotView.robots = function() {
  return Meteor.users.find({profile: {robot: true}}).fetch();
};

Template.robotView.loggedInAsRobot = function() {
  var user = Meteor.user();
  return (user && user.profile.robot);
};

Template.robotListitem.events({
  'mouseup': function() {
    Session.set('selectedRobot', this.username);
    Meteor.loginWithPassword(this.username, this.username);
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
  return !(Session.get('inVideoChat'));
};

Template.robotVideo.events({
  'touchstart .eyes': function() {
    var eyes = document.querySelector('.eyes');
    eyes.play();
    eyes.loop = false; 
    eyes.addEventListener('ended', function() { 
      eyes.currentTime=0.1; eyes.play();
    }, false);
  }
});

Template.main.userIsNotRobot = function() {
  var user = Meteor.user();
  return (user && !user.profile.robot);
};
Template.main.inVideoChat = function() {
  return Session.get('inVideoChat');
};
