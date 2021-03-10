const request = require("request-promise");
const cheerio = require("cheerio");
const fs  = require("fs");
const json2csv = require("json2csv").Parser;
const populationArray = new Array();
const MedianArray = new Array();
const propertyDataURL = "https://www.smartpropertyinvestment.com.au/data/nsw/2075/st-ives";
let propertyData =[];


 (async()=>
 {
   try 
   {
   

        const response = await request({
            uri : propertyDataURL,
            headers:{
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,la;q=0.7"
            },
            br : true
    });

            let $ = cheerio.load(response);

            $('div[class="b-module module_container"]>table>tbody>tr:nth-child(1').each((index, element) => {
                MedianArray.push($(element).text());

            });

            $('div[class="b-suburbprofilepage__demo__head__item__number"]').each(function(){
                populationArray.push($(this).text());
        })


                propertyData.push({

                        MedianArray,
                        populationArray

                })


           
            const json2csvParser = new json2csv();
            const csv = json2csvParser.parse(propertyData);
            fs.writeFileSync("./csv/data.csv",csv,"utf-8");

            }
            catch(error){console.error()};


            
})();








