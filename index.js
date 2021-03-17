const puppeteer = require("puppeteer");
// const fs  = require("fs");
// const json2csv = require("json2csv").Parser;
const {google} = require('googleapis');
const keys= require("./keys.json");

let propertyData =[];
let dataObtained =[];
let dataObtainedArray=[];
let dataObtainedArray1D =[];
const client  = new google.auth.JWT(
    keys.client_email, 
    null, 
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function(err,tokens){

    if(err)
    {
        console.log(err);
        return;
    } else{
        console.log('connected!!!')
        gsrun(client);
    }

})
 
async function gsrun(cl)
{
    const gsapi = google.sheets({version:'v4', auth:cl});
    const opt ={
        spreadsheetId : '1HWQgo0RiXy98DizjDfFb12LP5aXK5LiuCSDoyc8kMnc',
        range: "Sheet1!A3:A8"
        

    };
    

    dataObtained= await gsapi.spreadsheets.values.get(opt);
    console.log(dataObtained);
    dataObtainedArray = dataObtained.data.values;
    console.log(dataObtainedArray);
    dataObtainedArray1D = [].concat(...dataObtainedArray);
    console.log(dataObtainedArray1D);
  


   
    const updateopt ={
        spreadsheetId : '1vE8q7eGAn3tdivMGle1pLSNGyB8uuGm8wWUjbS5KsOk',
        range: "Sheet1!A2",
        valueInputOption : 'USER_ENTERED',
        resource  : {values : propertyData}
    
        
    
    };
    
    let res  = await gsapi.spreadsheets.values.update(updateopt);
    console.log(res);
}


(async function main(){

    try 
    {
        const browser = await puppeteer.launch({headless:true});
        const page = await browser.newPage();
        page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'
           )
        
        for (const url of dataObtainedArray1D)
        {
      
        await page.goto(url)
        
       

        const data = await page.$$eval('table tr td', tds => tds.map((td) => {
            return td.innerText;
          }));
    
        const MedianPrice = data[0]; //MedianPrice
        const House = data[1]; //House
        const Unit = data[2]; //Unit

        
        let result = await page.$$eval('.b-suburbprofilepage__demo__head__item .b-suburbprofilepage__demo__head__item__number', names => names.map(name => name.textContent));

        
        let res = Object.values(result);
      
        const totalPopulation = res[0].trim(); //Total Population
        const weeklyHouseHoldIncome = res[1].trim(); //Weekly Household Income
        const householdSize  = res[2].trim(); //House Hold Size

        propertyData.push([ MedianPrice,
            House,
            Unit,
            totalPopulation,
            weeklyHouseHoldIncome,
            householdSize]);
            console.log(propertyData);
            propertyData=[];

        
        }
        

    }
    catch(e)
    {
        console.log('our error',e);
    }

})();

