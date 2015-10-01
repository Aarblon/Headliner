var Band_Genres = require('./band_genres.js');
var Band_Members = require('./band_members.js');
var knex = require('../db/db.js');

module.exports = {

  create: function(reqBody) {
    return knex('Bands')
      .returning('band_id')
      .insert({
        band_name: reqBody.band_name, 
        onTour: reqBody.onTour,
        email: reqBody.email, 
        phone: reqBody.phone, 
        record_label: reqBody.record_label,
        facebook: reqBody.facebook,
        youtube: reqBody.youtube,
        soundcloud: reqBody.soundcloud,
        bandcamp: reqBody.bandcamp,
        website: reqBody.website,
        bio: reqBody.bio,
        zip: reqBody.zip, 
        city: reqBody.city,
        state: reqBody.state, 
        contact_name: reqBody.contact_name 
      }).then(function(band_id) {
        for(var genre in reqBody.genre) {
          if (reqBody.genre[genre]) {
            Band_Genres.addGenre(band_id[0], genre);
          }
        }
        for (var member in reqBody.member) {
          Band_Members.addMember(band_id[0], member, reqBody.member[member]);
        }
        return band_id[0];
      });
  },
  
  update: function(reqBody) {
    return knex('Bands')
      .where({'band_id': reqBody.band_id})
      .returning('band_id')
      .update({
        band_name: reqBody.band_name, 
        onTour: reqBody.onTour,
        email: reqBody.email, 
        phone: reqBody.phone, 
        record_label: reqBody.record_label,
        facebook: reqBody.facebook,
        youtube: reqBody.youtube,
        soundcloud: reqBody.soundcloud,
        bandcamp: reqBody.bandcamp,
        website: reqBody.website,
        bio: reqBody.bio,
        zip: reqBody.zip, 
        city: reqBody.city,
        state: reqBody.state, 
        contact_name: reqBody.contact_name 
      }).then(function(band_id) {
        Band_Genres.removeAll(band_id[0]).then(function() {
          for(var genre in reqBody.genre) {
            if (reqBody.genre[genre]) {
              Band_Genres.addGenre(band_id[0], genre);
            }
          }
        });
        Band_Members.removeAll(band_id[0]).then(function() {
          for (var member in reqBody.member) {
            Band_Members.addMember(band_id[0], member, reqBody.member[member]);
          }
        });
      });
  },

  getAll: function() {
    return knex('Genres')
      .join('Band_Genres','Genres.genre_id','Band_Genres.genre_id')
      .then(function(band_genres) {
        var genres = {};
        for (var i = 0; i < band_genres.length; i++) {
          if (genres[band_genres[i].band_id]) {
            genres[band_genres[i].band_id][band_genres[i].genre_name] = true;
          } else {
            genres[band_genres[i].band_id] = {};
            genres[band_genres[i].band_id][band_genres[i].genre_name] = true;
          }
        }
        return genres;
    }).then(function(genres) {
      return knex('Band_Members')
        .then(function(bandMembers) {
          var members = {}
          for (var i = 0; i < bandMembers.length; i++) {
            if (members[bandMembers[i].band_id]) {
              members[bandMembers[i].band_id][bandMembers[i].member_name] = bandMembers[i].title;
            } else{
              members[bandMembers[i].band_id] = {}
              members[bandMembers[i].band_id][bandMembers[i].member_name] = bandMembers[i].title;
            }
          }
          return [genres, members];
      }).then(function(genres_bandMembers) {
        return knex('Venues')
          .join('Shows', 'Venues.venue_id','Shows.venue_id')
          .then(function(venues_shows) {
            var shows = {};
            for (var i = 0; i < venues_shows.length; i++) {
              if (shows[venues_shows[i].band_id]) {
                shows[venues_shows[i].band_id].push({
                  'venue': venues_shows[i].venue_name,
                  'date': venues_shows[i].date
                });
              } else {
                shows[venues_shows[i].band_id] = [{
                  'band': venues_shows[i].venue_name,
                  'date': venues_shows[i].date
                }]
              }
            }
            return genres_bandMembers.concat(shows);
          })
      }).then(function(genres_bandMembers_shows) {
        return knex('Band_Reviews')
          .join('Shows','Band_Reviews.show_id', 'Shows.show_id')
          .join('Venues','Shows.venue_id', 'Venues.venue_id')
          .then(function(rsv) {
            var reviews = {};
            for (var i = 0; i < rsv.length; i++) {
              if (reviews[rsv[i].band_id]) {
                reviews[rsv[i].band_id].push({
                  'venue': rsv[i].venue_name,
                  'shows-date': rsv[i].date,
                  'rating': rsv[i].rating,
                  'comment': rsv[i].comment
                });
              } else {
                reviews[rsv[i].band_id] = [{
                  'venue': rsv[i].venue_name,
                  'shows-date': rsv[i].date,
                  'rating': rsv[i].rating,
                  'comment': rsv[i].comment
                }];
              }
            }
            return genres_bandMembers_shows.concat(reviews);
          })
      }).then(function(genres_bandMembers_shows_reviews) {
        return knex('Bands').then(function(bands) {
          return bands.map(function(band) {
            band.genre = genres_bandMembers_shows_reviews[0][band.band_id];
            band.members = genres_bandMembers_shows_reviews[1][band.band_id];
            band.shows = genres_bandMembers_shows_reviews[2][band.band_id];
            band.reviews = genres_bandMembers_shows_reviews[3][band.band_id];
            return band;
          })
        })
      })
    })
  }

};
