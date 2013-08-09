Session.set('myVideoSrc', '');
Session.set('inVideoChat', false);

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


Template.users.events({
  'mousedown .user': function() {
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
    Session.set('inVideoChat', true);
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


