// 'headliner.service'


(function(){

  angular.module('headliner.authService', [])

  .factory('Auth', Auth)

  function Auth ($http, $location, $window) {

    function signupGeneral(user) {
      console.log('signupGeneral POST: ', user);
      return $http({
        method: 'POST',
        url: '/api/users/local', 
        data: user
      })
      .then(function(resp) {
        return resp.data.token;
      });
    };

    function signupVenue(user) {
      console.log('signupVenue POST: ', user);
      return $http({
        method: 'POST',
        url: '/api/users/venues', 
        data: user
      })
      .then(function(resp) {
        return resp.data.token;
      });
    };

    function signupArtist(user) {
      console.log('signupArtist POST: ', user);
      return $http({
        method: 'POST',
        url: '/api/users/artists', 
        data: user
      })
      .then(function(resp) {
        return resp.data.token;
      });
    };    

    function login (user) {
      return $http({
        method: 'POST',
        url: '/api/users/login', /* get route */
        data: user
      })
      .then(function(resp) {
        return resp.data;
      });
    };

    // check if a user is authorized when user switch pages on app
    function isAuth () {
      return !!$window.localStorage.getItem('headliner');
    };

    // signout user by removing token that is stored in the client's localStorage
    function signout () {
      $window.localStorage.removeItem('headliner');
      $location.path('/');
    };

    return {
      signupGeneral: signupGeneral,
      signupVenue: signupVenue,
      signupArtist: signupArtist,
      login: login,
      isAuth: isAuth,
      signout: signout
    };
  };

})();