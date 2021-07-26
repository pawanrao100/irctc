var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://indianrailways.p.rapidapi.com/findstations.php',
  params: {station: 'delhi'},
  headers: {
    'x-rapidapi-key': 'b411216a50msh8d8175de8ed0a80p10b817jsn1726c69a7300',
    'x-rapidapi-host': 'indianrailways.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});