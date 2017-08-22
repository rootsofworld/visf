const request = require('request');
const rp = require('request-promise');
const fs = require('fs');
//const parser = require('xml2js').Parser();
const async = require('async');

var year = '2016';
var month = '04';
var date = '01';

if(process.argv.length > 2){

    month = checkInput(process.argv[2]);
    date = checkInput(process.argv[3]);

}

function checkInput(n){
    if(n < 10){
        return "0" + n;
    }else{
        return "" + n;
    }
}


    let gameData = {'season': year, 'month': month, 'date': date, 'data': []}; 
    rp(`http://gd2.mlb.com/components/game/mlb/year_${year}/month_${month}/day_${date}/miniscoreboard.json`)
        .then((body) => {

            var gamepkList = [];
            var scoreboard = JSON.parse(body);
            scoreboard.data.games.game.forEach((game) => {
                gamepkList.push(game.game_pk);
            })
            console.log(`Get game list at ${year}-${month}-${date}...`)
            return gamepkList;

        }).catch( err => {
            console.log(err);
            process.exit(1);
        }).then( gameIDList  => {
            
            return Promise.all( 
                gameIDList.map( gameID  => {
                    console.log(`Game ID : ${gameID}`);
                    return  rp(`http://statsapi.mlb.com/api/v1/game/${gameID}/feed/live?language=en`);
            }));

        }).then( body => {

            var  data = body.map(d => JSON.parse(d));
            return data;
        
        }).then( data => {
            //console.log(dataa.map(d => d.gameData.game.id));
            gameData.data = data.map(d =>  {
                return {

                    gameData : d.gameData,
                    lineScore : d.liveData.linescore
                
                }
            });
            fs.writeFile(`data/${year}${month}${date}_gameday.json`,JSON.stringify(gameData),'utf8',(err) => {
                if (err) throw err;
                console.log(`Data wrote in file : ${year}${month}${date}_gameday.json`);
            })
            
        });
    

function month2days() {
    var days;
    var littleMonth = ['04','06','09','11'];
    if(month == '02'){
        if (year % 4 == 0 && year % 100 != 0) {
                days = 29;
            } else {
                if (year % 400 == 0) {
                    days = 29;
                } else {
                    days = 28;
                }
            }
    }else if(littleMonth.include(month)){
        days = 30;
    }else{
        days = 31;
    }

    return days;
}




   




