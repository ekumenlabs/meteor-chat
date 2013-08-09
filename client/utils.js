getFriendlyName = function(user) {
  if (user) {
    if (user._id == Meteor.userId()) {
      return 'me';
    }
    return user.username || user.profile.name || user.facebook.first_name || user.services.google.name;
  }
  return 'anonymous';
};

getEmail = function(userid) {
  if (userid) {
    var user = Meteor.users.findOne(userid);
    if (user) {
      if (user.services.github) {
        return user.services.github.email;
      } else if (user.services.google) {
        return user.services.google.email;
      } else if (user.services.facebook) {
        return user.services.facebook.email;
      }
    }
  }
  return 'anonymous';
};

getIcon = function(userid, res) {
  if (userid) {
    var user = Meteor.users.findOne(userid);
    if (user && user.services) {
      if (user.services.google && user.services.google.picture) {
        return user.services.google.picture; 
      } else if (user.services.facebook) {
        return "https://graph.facebook.com/" + user.services.facebook.username + "/picture";
      } else if (user.services.github) {
        var hash = hex_md5(user.services.github.email);
        return "http://gravatar.com/avatar/" + hash;
      }
    }
  }
  return "http://placekitten.com/" + res + "/" + res;
};

isOnline = function(userid) {
  var presence = Meteor.presences.findOne({userId: userid});
  if (presence) {
    return presence.state == 'online';
  } else {
    return false;
  }
};

hasGetUserMedia = function() {
  // Note: Opera is unprefixed.
  return !!(navigator && (navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia));
};


