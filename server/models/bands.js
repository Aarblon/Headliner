var Users = require('./models/users.js');
var Genres = require('./models/users.js');
var Locations = require('./models/users.js');
var Shows

module.exports = function(knex) {

  return {

    findBand: function(username) {
      return knex('Users')
        .where('Username': username)
        .select('band_id')      
    },

    addGenre: function(genre, band_id) {
      Genres.findGenreId(genre)
        .then(function(genre_id) {
          return knex('Band_Genres').insert({
            'genre_id': genre_id,
            'band_id': band_id
          })
        })
    },

    addShow: function(band_id, venue_id, date) {
      return knex('Shows').insert({
        'band_id': band_id,
        'venue_id': venue_id,
        'date': date
      })
    },

    addBandMember: function(band_id, member_name, title) {
      return knex('Band_Members').insert({
        'band_id': band_id,
        'member_name': member_name,
        'title': title
      })
    },

    addBandName: function(band_id, band_name) {
      return knex('Bands').insert({
        'band_name': band_name
      }).where({
        'band_id': band_id
      })
    }

    addLocation: function(zipcode) {
      Locations.findLocationId(zipcode)
        .then(function(location_id){
          return knex('Bands').insert({
            'location_id': location_id
          })
        })
    },

    addFacebookUrl: function(url, band_id) {
      return knex('Bands').insert({
        'facebook_url': url
      }).where({
        'band_id': band_id
      })
    },

    addSoundCloudUrl: function(url, band_id) {
      return knex('Bands').insert({
        'soundcloud_url': url
      }).where({
        'band_id': band_id
      })
    },

    addYouTubeUrl: function(url, band_id) {
      return knex('Bands').insert({
        'youtube_url': url
      }).where({
        'band_id': band_id
      })
    },

    // addTwitterUrl: function(url, band_id) {
    //   return knex('Bands').insert({
    //     'twitter_url': url
    //   }).where({
    //     'band_id': band_id
    //   })
    // },

    // addInstagramUrl: function(url, band_id) {
    //   return knex('Bands').insert({
    //     'instagram_url': url
    //   }).where({
    //     'band_id': band_id
    //   })
    // },




  }
};