//https://developer.spotify.com/documentation/web-api/tutorials/getting-started
const express = require('express');
const request = require('request');
const app = express();
const port = 5000;
const artistName = 'Queen';  // Example: Searching for Queen
const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`;
var token;
var client_id = '975be576524f4742a5eabdc215b9fe9b';
var client_secret = 'bf9981d9b5d44a9986d7c2d6641161e9';

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
    res.sendFile('index.html', {root: __dirname});
})
app.get('/lols', async function (req, res) {
  try {
    let token = await getResults();  // Await the promise resolution to get the token
    console.log(token);  // Now you can access the token here
    //res.send("Token: " + token);  // Send the token in the response if needed
  } catch (error) {
    console.log(error);
    res.status(500).send("Error occurred");
  }
  getProfile(token);
})

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});
function getResults(){
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
async function getProfile(tok_lol) {
  //let accessToken = localStorage.getItem('access_token');
  console.log(tok_lol);
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + tok_lol
    }
  });

  const data = await response.json();
  console.log(data);
}


