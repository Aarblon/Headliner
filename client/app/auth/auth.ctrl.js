(function(){

  angular.module('headliner.auth', [])

  .controller('AuthController', AuthController);

  function AuthController ($scope, $window, $location, Auth, Global, Music, Messages, $rootScope) {
    $scope.venue = {};
    $scope.user = {}; // for artists
    $scope.user.member = {};

    $scope.states = Global.states;
    $scope.allGenres = Global.allGenres;
    $scope.allTypes = Global.allTypes;

    $scope.songs = [];

    $scope.song = {
      url: undefined,
      title: undefined,
      artist: undefined
    }

    $scope.addSongtoList = function (song) {
      $scope.songs.push(song);
      $scope.user.songs = $scope.songs;
      $scope.song = null;
    }

    $scope.signupGeneral = function () {
      Auth.signupGeneral($scope.user)
        .then(function (data) {
          $window.localStorage.setItem('headliner', data.token);
          $window.localStorage.setItem('type', null);
          $location.path('/select'); 
          $rootScope.init();
        })
        .catch(function (error) {
            $scope.user.error = 'Username is already taken.'
            console.error(error);
        });
    };

    $scope.signupVenue = function () {
      Auth.signupVenue($scope.venue)
        .then(function (data) {
          $window.localStorage.setItem('headliner', data.token);
          $window.localStorage.setItem('type', 'venue');
          $location.path('/homepage-venue');
          $rootScope.init();
        })
        .catch(function(error){
          console.log(error);
        });
    };

    $scope.signupArtist = function () {
      Auth.signupArtist($scope.user)
        .then(function (data) {
          $window.localStorage.setItem('headliner', data.token);
          $window.localStorage.setItem('type', 'artist');
          $location.path('/homepage-artist');
          $rootScope.init();
        })
        .catch(function(error){
          console.log(error);
        });
    };    

    //Sets a artist member's name as a property in the
    //member object, their role as the value
    $scope.addNewMember = function(name, role){
        $scope.user.member[name] = role;
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
    
    $rootScope.init = function() {
      Messages.getMessages().then(function(messages) {
        $rootScope.unread = messages.reduce(function(unread, message) {
          return message.unread + unread;
        },0);
      });
      Auth.getUserById().then(function(user) {
        if (user[0].venue_id) {
          $rootScope.id = user[0].venue_id;
        } else if (user[0].artist_id) {
          $rootScope.id =  user[0].artist_id;
        }
      });
      $rootScope.type = $window.localStorage.getItem('type');
    };

  }
})();
