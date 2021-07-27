const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
var axios = require("axios").default;

//set view file
app.set('views',path.join(__dirname,'views'));
app.use(express.static(__dirname + '/public'));
//set view engine

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get('/',(req,res)=>{
    res.render('index',
    {
        title:'Have you not found the right one? Find a service suitable for you here.'
    });
})

app.get('/railwayStations',(req,res)=>{
    res.render('station_search',
    {
        title:'Search Railway Station in Your City'
    });
})

app.get('/pnr',(req,res)=>{
    res.render('pnr_search',{
        title : 'Search PNR'
    })
})


app.get('/train',(req,res)=>{
    res.render('train_search',{
        title : 'Search Trains'
    })
})

app.post('/searchPnr',(req,res)=>{
    let keyword = req.body.keyword;
    var options = {
        method: 'GET',
        url: `https://pnr-status-indian-railway.p.rapidapi.com/rail/${keyword}`,
        headers: {
          'x-rapidapi-key': 'b411216a50msh8d8175de8ed0a80p10b817jsn1726c69a7300',
          'x-rapidapi-host': 'pnr-status-indian-railway.p.rapidapi.com'
        }
      };
      
      axios.request(options).then(function (response) {
            res.render('pnr_status', {
            title : 'Passenger Current Status Enquiry',
            pnrData : response.data,
            pnrNumber: keyword
        });
      }).catch(function (error) {
          console.error(error);
      });
      
});


app.post('/searchStation',(req, res) => { 
    let keyword = req.body.keyword;
    
    var options = {
        method: 'GET',
        url: 'https://indianrailways.p.rapidapi.com/findstations.php',
        params: {station: keyword},
        headers: {
          'x-rapidapi-key': 'b411216a50msh8d8175de8ed0a80p10b817jsn1726c69a7300',
          'x-rapidapi-host': 'indianrailways.p.rapidapi.com'
        }
      };
      
      axios.request(options).then(function (response) {
          if(Object.keys(response.data.stations).length > 0){
        res.render('railway_station_list', {
            title : `Railway Stations in ${keyword}`,
            users : response.data.stations
            
        });
    }else{
        res.render('error',{
            title: 'Record not found'
          });
        }
      }).catch(function (error) {
          res.render('error',{
            title: 'Record not found'
          });
      });
      
});


app.post('/searchTrain',(req, res) => { 
    let keyword = req.body.keyword;
    
    var options = {
        method: 'POST',
        url: 'https://trains.p.rapidapi.com/',
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-key': 'b411216a50msh8d8175de8ed0a80p10b817jsn1726c69a7300',
          'x-rapidapi-host': 'trains.p.rapidapi.com'
        },
        data: {search: keyword}
      };
      
      axios.request(options).then(function (response) {
          if(Object.keys(response.data).length > 0){
            res.render('train_list', {
                title : `All trains ${keyword}`,
                trainsData : response.data
            });
        }else{
            res.render('error',{
                title: 'Record not found'
              });
            }
      }).catch(function (error) {
          console.error(error);
      });
       
});

// app.listen('8000',()=>{
//     console.log('port running on 8000');
// });

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });