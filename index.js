const puppeteer = require("puppeteer");
const fs  = require("fs");
const json2csv = require("json2csv").Parser;


let propertyData =[];

(async function main(){

    try 
    {
        const browser = await puppeteer.launch({headless:true});
        const page = await browser.newPage();
        page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'
           )
        await page.goto('https://www.smartpropertyinvestment.com.au/data/nsw/2075/st-ives')

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

        propertyData.push({
            MedianPrice,
            House,
            Unit,
            totalPopulation,
            weeklyHouseHoldIncome,
            householdSize
        })

        console.log(propertyData);
        const json2csvParser = new json2csv();
        const csv = json2csvParser.parse(propertyData);
        fs.writeFileSync("./csv/data.csv",csv,"utf-8");

        

    }
    catch(e)
    {
        console.log('our error',e);
    }

})();
 
