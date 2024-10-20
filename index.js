//https://developer.spotify.com/documentation/web-api/tutorials/getting-started
//for user specific data, use AUTHORIZATION CREDENTIALS FLOW rather than CLIENT CREDENTIALS FLOW
const express = require('express');
const request = require('request');

const app = express();
const port = 5000;
const artistName = 'Bruno Mars';  // Example: Searching for Queen
const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`;
var token;
app.set('view engine', 'ejs');
app.set('views', './views');  // This points to the 'views' folder
var client_id = '975be576524f4742a5eabdc215b9fe9b';
var client_secret = 'bf9981d9b5d44a9986d7c2d6641161e9';
var artist_string = {something: "90"}
var top_tracks = {tracks:""}
var artist_string_new = {}
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};
app.get('/', function (req, res) {
    res.render('index', top_tracks);
})
app.get('/lols', async function (req, res) {
  try {
    let token = await getClientCreds();  // Await the promise resolution to get the token
    //console.log(searchUrl);  // Now you can access the token here
    //res.send("Token: " + token);  // Send the token in the response if needed
  } catch (error) {
    //console.log(error);
    res.status(500).send("Error occurred");
  }
  let artlol = await getArtist(token);
  //console.log(artlol);
  artist_string = artlol.artists.items[0];
  console.log(artlol.artists.items[0].id);
  console.log(token);
  top_tracks = await getTopTracks(artlol.artists.items[0].id, token) //get top tracks
  console.log(top_tracks)
  res.redirect("/");
})

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    //console.log(`Now listening on port ${port}`); 
});
function getClientCreds(){
  return new Promise((resolve, reject) => {
  request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {
      token = body.access_token;
      console.log(body);
      resolve(token);
  }
  else{
    reject("Error fetching token");
  }
  });
});
}
async function getArtist(tok_lol) {
  //let accessToken = localStorage.getItem('access_token');
  //console.log(tok_lol);
  const response = await fetch(searchUrl, {
    headers: {
      Authorization: 'Bearer ' + tok_lol
    }
  });

  const data = await response.json();
  return data;
  //console.log(data.artists.items[0]);
}
async function getTopTracks(art_id, acc_token, market = 'US'){
  const topTracksUrl = `https://api.spotify.com/v1/artists/${art_id}/top-tracks?market=${market}`;
  
  const response = await fetch(topTracksUrl, {
    headers:{
      Authorization: 'Bearer '+ acc_token
    }
  });
  let data = await response.json();
  console.log(JSON.stringify(data.tracks[0]));
  return data;
}


