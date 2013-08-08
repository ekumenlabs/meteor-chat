Messages = new Meteor.Collection("msgs");
// chatStream = new Meteor.Stream('chat');

function getFriendlyName(userid) {
  if (userid) {
    var user = Meteor.users.findOne(userid);
    if (user) {
      return user.username || user.profile.name || user.facebook.first_name || user.services.google.name;
    }
  }
  return 'anonymous';
}

if (Meteor.isClient) {
  // subscribe to these collections
  Meteor.subscribe('msgs');
  Meteor.subscribe('users');
  Meteor.subscribe('userPresence');

  Template.chat.events({
    'submit' : function () {
      // template data, if any, is available in 'this'
      
      var text = msg.value;
      msg.value = '';

/*
      var from = Meteor.userId();
      var to = Template.users.selectedUserId;
      sendChatMessage(from, to, text);
    */

      console.log('Inserting message from:', Meteor.user(), Meteor.userId());
      var info = {text: text, userid: Meteor.userId()};
      if (Session.get('selected_user') !== null) {
        info.to = Session.get('selected_user');
      }
      Messages.insert(info);
      // Put focus back in input box
      msg.focus();
    }
  });

  Template.chat.msgs = function() {
    return Messages.find().fetch();
  };

  Template.msg.author = function() {
    return getFriendlyName(this.userid);
  };

  Template.msg.icon = function() {
    if (this.userid) {
      var user = Meteor.users.findOne(this.userid);
      if (user && user.services) {
        if (user.services.google && user.services.google.picture) {
          return user.services.google.picture; 
        } else if (user.services.facebook) {
          return "https://graph.facebook.com/" + user.services.facebook.username + "/picture";
        }
      }
    }
    return "http://placekitten.com/32/32";
  };

  Template.msg.friendlyto = function() {
    return getFriendlyName(this.to);
  };

  Template.msg.events({
    'click .delete': function() {
      Messages.remove(this._id);
    }
  });

  Template.users.users = function() {
    return Meteor.users.find().fetch();
  };

  Session.set('selected_user', null);

  Template.users.events({
    'mousedown .user': function() {
      if (Session.equals('selected_user', this._id)) {
        Session.set('selected_user', null);
      } else {
        Session.set('selected_user', this._id);
      }
    }
  });

  Template.user.icon = function() {
    if (this && this.services) {
      if (this.services.google && this.services.google.picture) {
        return this.services.google.picture; 
      } else if (this.services.facebook) {
        return "https://graph.facebook.com/" + this.services.facebook.username + "/picture";
      }
    }
    return "http://placekitten.com/64/64";
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
    var presence = Meteor.presences.findOne({userId: this._id});
    if (presence) {
      return presence.state == 'online';
    } else {
      return false;
    }
  };

/*
  // Client-to-client messaging
  sendChatMessage = function(from, to, msg) {
    chatStream.emit('message', {from: from, to: to, msg: msg});
    console.log('I sent:', msg);
  };

  chatStream.on('message', function(data) {
    console.log('user: ', data.msg);
  });
*/
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  /* We don't need this because we have autopublish turned on */
  Meteor.publish('msgs', function() {
    return Messages.find();
  });
  Meteor.publish('users', function() {
    return Meteor.users.find();
  });

  Meteor.publish('userPresence', function() {
    // For now we'll just publish presence on everyone who's ever logged in
    var filter = {};
    console.log('Publishing userPresence', Meteor.presences.find().count());
    return Meteor.presences.find(filter, {fields: {state: true, userId: true}});
  });
}
