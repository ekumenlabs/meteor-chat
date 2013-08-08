Messages = new Meteor.Collection("msgs");
// chatStream = new Meteor.Stream('chat');

if (Meteor.isClient) {
  Meteor.subscribe('msgs');

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
      Messages.insert({text: text, userid: Meteor.userId()});
      // Put focus back in input box
      msg.focus();
    }
  });

  Template.chat.msgs = function() {
    return Messages.find().fetch();
  };

  Template.msg.author = function() {
    if (this.userid) {
      var user = Meteor.users.findOne(this.userid);
      if (user) {
        return user.username || user.profile.name || user.facebook.first_name || user.services.google.name;
      }
    }
    return 'anonymous';
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

  Template.msg.events({
    'click .delete': function() {
      Messages.remove(this._id);
    }
  });

  Template.users.users = function() {
    return Meteor.users.find().fetch();
  };

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
    return this.thisname || this.profile.name || this.facebook.first_name || this.services.google.name ||
      "anonymous";
  };

  Template.user.status = function() {
    var presence = Meteor.presences.findOne({userId: this._id});
    if (presence) {
      return presence.state;
    } else {
      return 'offline';
    }
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
  /*
  Meteor.publish('msgs', function() {
    return Messages.find();
  });
  */

  Meteor.publish('userPresence', function() {
    // For now we'll just publish presence on everyone who's ever logged in
    var filter = {};
    return Meteor.presences.find(filter, {fields: {state: true, userId: true}});
  });
}
