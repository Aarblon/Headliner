(function(){

  angular.module('headliner', [
    'headliner.authService',
    'headliner.homeService', 
    'headliner.profileService',
    'headliner.editService',
    'headliner.editVenue',
    'headliner.editArtist',
    'headliner.globalService',
    'headliner.messagesService',
    'headliner.requestsService',
    'headliner.musicService',
    'headliner.auth',
    'headliner.venueHomepage',
    'headliner.artistHomepage',
    'headliner.venueProfile',
    'headliner.artistProfile',
    'headliner.messages',
    'headliner.conversation',
    'headliner.requests',
    'headliner.music',
    'ngRoute',
    'headliner.aws',
    'ui.router',
    'ui.bootstrap',
    'xeditable',
    'headliner.directives',
    'headliner.jwt'
  ])

  .config(config)
  .factory('AttachTokens', AttachTokens)

  function config($routeProvider, $httpProvider, $stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('test', {
        templateUrl: 'app/auth/test.html',
        url: '/test',
        controller: 'AWSController'
      })
      .state('landing', {
        templateUrl: 'app/auth/landing.html',
        url: '/',
        controller: function($scope){
          $(document).ready(function(){
            $('.parallax').parallax();
          });
        }
      })
      .state('auth-init', {
        templateUrl: 'app/auth-init/auth-init.html',
        url: '/auth-init',
        controller: 'JwtController'
      })
      .state('login', {
        templateUrl: 'app/auth/login.html',
        url: '/login',
        controller: 'AuthController'
      }) 
      .state('signup', {
        templateUrl: 'app/auth/signup.html',
        url: '/signup',
        controller: 'AuthController'
      })
      .state('signup-select', {
        templateUrl: 'app/auth/signup-select.html',
        url: '/select',
        controller: 'AuthController'
      })           
      // VENUE FORM (nested views)
      .state('signup-venue', {
        templateUrl: 'app/auth/signup-venue/signup-venue.html',
        url: '/signup-venue',
        controller: 'AuthController'
      })  
      .state('signup-venue.basic', {
        templateUrl: 'app/auth/signup-venue/signup-venue-basic.html',
        url: '/basic'
      })
      .state('signup-venue.more', {
        templateUrl: 'app/auth/signup-venue/signup-venue-more.html',
        url: '/more'
      }) 
      .state('signup-venue.about', {
        templateUrl: 'app/auth/signup-venue/signup-venue-about.html',
        url: '/about'
      })
      .state('signup-venue.contact', {
        templateUrl: 'app/auth/signup-venue/signup-venue-contact.html',
        url: '/contact'
      })
      .state('signup-venue.terms', {
        templateUrl: 'app/auth/signup-venue/signup-venue-terms.html',
        url: '/terms'
      }) 
      //ARTIST SIGNUP FORM
      .state('signup-artist', {
        templateUrl: 'app/auth/signup-artist/signup-artist.html',
        url: '/signup-artist',
        controller: 'AuthController'
      })
      .state('signup-artist.basic', {
        templateUrl: 'app/auth/signup-artist/signup-artist-basic.html',
        url: '/basic'
      })
      .state('signup-artist.about', {
        templateUrl: 'app/auth/signup-artist/signup-artist-about.html',
        url: '/about'
      })
      .state('signup-artist.music', {
        templateUrl: 'app/auth/signup-artist/signup-artist-music.html',
        url: '/music'
      })      
      .state('signup-artist.label', {
        templateUrl: 'app/auth/signup-artist/signup-artist-label.html',
        url: '/label'
      })
      .state('signup-artist.contact', {
        templateUrl: 'app/auth/signup-artist/signup-artist-contact.html',
        url: '/contact'
      })
      .state('signup-artist.terms', {
        templateUrl: 'app/auth/signup-artist/signup-artist-terms.html',
        url: '/terms'
      })                                                                                     
      .state('homepage-artist', {
        templateUrl: 'app/homepage/homepage-artist.html',
        url: '/homepage-artist',
        controller: 'ArtistHomepageController' 
      })
      .state('homepage-venue', {
        templateUrl: 'app/homepage/homepage-venue.html',
        url: '/homepage-venue',
        controller: 'VenueHomepageController' 
      })
      // VENUE PROFILE 
      .state('profile-venue', {
        templateUrl: 'app/profiles/profile-venue/profile-venue.html',
        url: '/profile-venue/:id',
        controller: 'VenueProfileController'
      })
      // VENUE PROFILE (nested views)                                    
      .state('profile-venue.overview', {
        templateUrl: 'app/profiles/profile-venue/overview.html',
        url: '/venue-overview'
      }) 
      .state('profile-venue.reviews', {
        templateUrl: 'app/profiles/profile-venue/reviews.html',
        url: '/venue-reviews'
      }) 
      .state('profile-venue.events', {
        templateUrl: 'app/profiles/profile-venue/events.html',
        url: '/venue-events'
      }) 
      .state('profile-venue.photos', {
        templateUrl: 'app/profiles/profile-venue/photos.html',
        url: '/venue-photos'
      })    

      // ARTIST PROFILE 
      .state('profile-artist', {
        templateUrl: 'app/profiles/profile-artist/profile-artist.html',
        url: '/profile-artist/:id',
        controller: 'ArtistProfileController'
      })
      // ARTIST PROFILE (nested views)                                    
      .state('profile-artist.overview', {
        templateUrl: 'app/profiles/profile-artist/overview.html',
        url: '/artist-overview'
      })
      .state('profile-artist.music', {
        templateUrl: 'app/profiles/profile-artist/music.html',
        url: '/artist-music'
      })  
      .state('profile-artist.videos', {
        templateUrl: 'app/profiles/profile-artist/videos.html',
        url: '/artist-videos'
      })
      .state('profile-artist.photos', {
        templateUrl: 'app/profiles/profile-artist/photos.html',
        url: '/artist-photos'
      })                      
      .state('profile-artist.calendar', {
        templateUrl: 'app/profiles/profile-artist/calendar.html',
        url: '/artist-calendar'
      }) 
      .state('profile-artist.reviews', {
        templateUrl: 'app/profiles/profile-artist/reviews.html',
        url: '/artist-reviews'
      }) 

      // EDIT PROFILE 
      .state('edit-profile-venue', {
        templateUrl: 'app/edit-profile/edit-profile-venue.html',
        url: '/edit-profile-venue',
        controller: 'EditVenueController'
      })
      .state('edit-profile-artist', {
        templateUrl: 'app/edit-profile/edit-profile-artist.html',
        url: '/edit-profile-artist',
        controller: 'EditArtistController'
      })
      // SIGNOUT    
      .state('signout', {
        templateUrl: 'app/auth/landing.html',
        url: '/signout',
        controller: 'AuthController',
        resolve: (function (Auth) {
          Auth.signout();
        })
      })

      // MESSAGES
      .state('messages', {
        templateUrl: 'app/messages/messages.html',
        url: '/messages',
        controller: 'MessagesController'
      })

      // CONVERSATIONS
      .state('conversation', {
        templateUrl: 'app/messages/conversation.html',
        url: '/conversation/:id',
        controller: 'ConversationController'
      })

      //REQUESTS
      .state('requests', {
        templateUrl: 'app/requests/requests.html',
        url: '/requests',
        controller: 'RequestsController'
      })

    // Add AttachTokens to $httpInterceptor, add token from local storage the to header of http request to server
    $httpProvider.interceptors.push('AttachTokens');
  }

  function AttachTokens ($window) {
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('headliner');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  }

})();
