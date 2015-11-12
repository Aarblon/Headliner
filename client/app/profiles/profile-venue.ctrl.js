(function() {
  angular.module('headliner.venueProfile', []).controller('VenueProfileController',
    ProfileController);

  // Profile is the injected service 
  function ProfileController($scope, $window, $location, $rootScope, Profile, Messages, Auth) {
    $scope.request = {};
    $scope.request.message = "We want to play!";
    $scope.id = $location.$$path.slice(($location.$$path).lastIndexOf('/')+1)
    $scope.review = {};

    //redirect if the user isn't logged in
    $scope.$watch(Auth.isAuth, function(authed) {
      if (!authed) {
        $location.path('/#/');
      }
    }, true);

    $scope.getVenueById = function(){
      Profile.getAllVenues().then(function(venues) {
        for (var venue in venues) {
          if (venues[venue].venue_id.toString() === $scope.id) {
            $scope.venue = venues[venue];
            //set profile picture to what we have in the database or a default if nothing exists
            $scope.profilePicture = $scope.venue.profile_pic || 'https://c2.staticflickr.com/4/3022/2294449993_44cef7f4a6.jpg';
          }
        }
      })
    };

    $scope.getVenueById();

    //the date to filter which shows are elligible for review
    $scope.today = new Date().toLocaleString().split(',')[0];

    //sets the shows object for the events tab, formatted as an array to utilize the orderBy function
    Profile.getShows().then(function(shows){
      $scope.shows = [];
      for (var i = 0 ; i < shows.length; i++) {
        if (shows[i].venue_id.toString() === $scope.id) {
          // $scope.shows[i] = shows[i]
          $scope.shows.push(shows[i]);
        };
        console.log($scope.shows, 'shows')
      };
    });

    Profile.getAllArtists().then(function(artists) {
      for (var show in $scope.shows) {
        console.log($scope.shows[show], 'show')
        var id = $scope.shows[show].artist_id;
        for (var artist in artists) {
          // console.log(artiss[venue], 'venue')
          if (artists[artist].artist_id === id) {
            $scope.shows[show].artist_name = artists[artist].artist_name
          }
        }
      }
    });
    
    //used for reviews of past shows
    $scope.rate = function($event) {
      $scope.review.rating = angular.element($event.currentTarget).attr('id')[5];
      console.log('I am rating!');
      // for(var i = 0; i < $window.document.getElementsByClassName('review-rating').length; i++) {
      //   if($window.document.getElementsByClassName('review-rating')[i].id[5] <= $scope.review.rating) {
      //     $window.document.getElementsByClassName('review-rating')[i].class = 'material-icons left review-rating blue accent-2' 
      //   } else {
      //     $window.document.getElementsByClassName('review-rating')[i].class = 'material-icons left review-rating blue lighten-5'
      //   }
      // }
      var test = angular.element(document);
      console.log('test: ', test);
    }
    
    $scope.reviewShow = function(show) {
      $scope.review = show;
    }

    $scope.sendRequest = function() {
      $scope.request.venue_id = $scope.id;
      $scope.request.receiver = 'venue';
      $scope.request.sender = 'artist';
      $scope.request.date = new Date($scope.date).toLocaleString().split(',')[0]
      Profile.sendRequest($scope.request);
    };

    $scope.sendMessage = function() {
      $scope.message.date = new Date().toISOString();
      $scope.message.id = parseInt($location.$$path.slice($location.$$path.lastIndexOf('/')+1));
      Messages.sendMessage($scope.message);
    };

    $scope.init = function() {
      $(document).ready(function(){
        $('ul.tabs').tabs();
      });
    }; 

    $scope.minDate = new Date();
    $scope.opened = false;

    $scope.open = function() {
      $scope.opened = true;
    };

    $scope.disabled = function(date) {
      if ($scope.venue.shows) {
        return $scope.venue.shows.map(function(show) {return show.date;}).indexOf(date.toISOString().split('T')[0]) > -1;
      }
    };

    $scope.checkType = function() {
      return $window.localStorage.getItem('type') !== $location.$$path.slice($location.$$path.lastIndexOf('-')+1,$location.$$path.lastIndexOf('/'));
    };

  };
})();
