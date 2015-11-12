var databasehost = process.env.HOST || 'localhost';

module.exports = {
 'secret': process.env.SECRET,
 
'facebookAuth': {
  'clientID': process.env.FACEBOOK_CLIENT_ID,
  'clientSecret': process.env.FACEBOOK_CLIENT_SECRET,
  'callbackURL': process.env.FACEBOOK_CALLBACK_URL 
},
'pgData': {
   client: 'postgresql',
   connection:  process.env.DATABASE_URL,
   migrations: {
     tableName: 'knex_migrations'
   }
 },
 'googleAuth': {
  'clientID': process.env.GOOGLE_CLIENT_ID,
  'clientSecret': process.env.GOOGLE_CLIENT_SECRET,
  'callbackURL': process.env.GOOGLE_CALLBACK_URL 
  },
 'AWS': {
  'accessKey': process.env.AWS_ACCESS_KEY_ID,
  'secretKey': process.env.AWS_SECRET_ACCESS_KEY,
  'bucket': process.env.S3_BUCKET_NAME
 }
}

