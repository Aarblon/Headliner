(function(){

  angular.module('headliner.auth', [])

  .controller('AuthController', AuthController);

  function AuthController ($scope, $window, $location, Auth, Global, Music, Messages, Requests, $rootScope) {
    $scope.venue = {};
    $scope.user = {}; // for artists
    $scope.user.members = {};

    $scope.states = Global.states;
    $scope.allGenres = Global.allGenres;
    $scope.allTypes = Global.allTypes;
    // $(document).ready(function(){
    //   $('.parallax').parallax();
    // });
    $scope.songs = [];

    $scope.song = {
      url: undefined,
      title: undefined
    }

    $scope.addSongtoList = function (song) {
      $scope.songs.push(song);
      $scope.user.songs = $scope.songs;
      $scope.song = null;
    }

    $scope.signupGeneral = function () {
      Auth.signupGeneral($scope.user)
        .then(function (data) {
          $location.path('/select'); 
          $window.localStorage.setItem('headliner', data.token);
          $window.localStorage.setItem('type', null);
        })
        .catch(function (error) {
            $scope.user.error = 'Username is already taken.'
            console.error(error);
        });
    };

    $scope.signupVenue = function () {
      Auth.signupVenue($scope.venue)
        .then(function (data) {
          $location.path('/homepage-venue');
          $window.localStorage.setItem('type', 'venue');
          $rootScope.init();
        })
        .catch(function(error){
          console.log(error);
        });
    };

    $scope.signupArtist = function () {
      Auth.signupArtist($scope.user)
        .then(function (data) {
          $location.path('/homepage-artist');
          $window.localStorage.setItem('type', 'artist');
          $rootScope.init();
        })
        .catch(function(error){
          console.log(error);
        });
    };    

    //Sets a artist member's name as a property in the
    //member object, their role as the value
    $scope.addNewMember = function(name, role){
        $scope.user.members[name] = role;
        $scope.name = "";
        $scope.role = "";
     };

    $scope.login = function () {
    Auth.login($scope.user)
      .then(function (data) {
        if(data.error) {
          $scope.login.error = data.error;
        } else {
          if (data.type === 'venue') {
            $location.path('/homepage-venue');
          } else if (data.type === 'artist') {
            $location.path('/homepage-artist');
          } else {
            $location.path('/select');
          }
          $window.localStorage.setItem('headliner', data.token);
          $window.localStorage.setItem('type', data.type);
          $rootScope.init();
        }
        console.log('dadadata', data)
      })
      .catch(function (error) {
        console.log('error with login: ', error)
      });
    };

    $scope.signout = function() {
      Auth.signout();
      $window.localStorage.removeItem('headliner');
      $window.localStorage.removeItem('type');
    };

    $scope.checkType = function(type) {
      return $window.localStorage.getItem('type') === type;
    };

    $scope.loggedIn = function() {
      return Auth.isAuth();
    };

    $scope.signingUp = function() {
      return $location.$$path.slice(1,7) === 'select' || $location.$$path.slice(1,7) === 'signup'; 
    };
    
    $rootScope.init = function() {
      $rootScope.type = $window.localStorage.getItem('type');
      Messages.getMessages().then(function(messages) {
        $rootScope.unreadMessages = messages.reduce(function(unreadMessages, message) {
          return message.unread + unreadMessages;
        },0);
      });
      Requests.getRequests().then(function(requests) {
        $rootScope.unreadRequests = requests.reduce(function(unreadRequests, request) {
          return !request.read && request.sender !== $rootScope.type ? unreadRequests + 1 : unreadRequests;
        },0);
      });
      Auth.getUserById().then(function(user) {
        if (user[0].venue_id) {
          $rootScope.id = user[0].venue_id;
        } else if (user[0].artist_id) {
          $rootScope.id =  user[0].artist_id;
        }
      });
    };
    $rootScope.init();

  }
})();
