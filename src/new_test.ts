import axios from "axios";
import { getCoinData } from "./api";
import { params } from "./param";
import { Bot} from "grammy";

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const bot_token="7351592175:AAHRKoYsnrMIEKM_qbw4BTFc6UCiajZl0TQ"
const bot = new Bot(bot_token);
const channel_id ='-1002214628234';

puppeteer.use(StealthPlugin());
const url = `
https://photon-sol.tinyastro.io/api/discover/search?buys_from=&buys_to=&dexes=pump&freeze_authority=false&lp_burned_perc=false&mint_authority=false&mkt_cap_from=&mkt_cap_to=&one_social=false&order_by=created_at&order_dir=desc&sells_from=&sells_to=&top_holders_perc=false&txns_from=&txns_to=&usd_liq_from=&usd_liq_to=&volume_from=&volume_to=`;
let loggedone:any=null


function formatTimeElapsed(currentTimeInSeconds:number, previousTimeInSeconds:number) {
  var elapsedTime = currentTimeInSeconds - previousTimeInSeconds;
  
  var hours = Math.floor(elapsedTime / 3600);
  var minutes = Math.floor((elapsedTime % 3600) / 60);
  var seconds = elapsedTime % 60;
  
  var formattedTime = hours + "hr " + minutes + "min " + seconds + "sec";
  return formattedTime;
}



const sendtoTg=async(filterData:any, creator:string,topOne:any)=>{
  const filled= filterData.filter((token:any) => token.complete === true);
  const launch=topOne.attributes
  const nonFilled=filterData.length-filled.length
  const tis=Date.now()/1000

  if(nonFilled-filled < 3){
    if(topOne.attributes.socials=== null){
const message = 
`🌟💊 New Good Creator Creation Detected 💊🌟\n
🏷 \*${launch.name} (${launch.symbol}-sol)\*
\`${launch.tokenAddress}\`

🔍\*Creator:\*[${creator.substring(0,5)}](https://pump.fun/profile/${creator})
💰 \*Market cap:\* $${Math.floor(launch.fdv)}

🌟\*Best Previous:\*${filterData[0].name}
\*ATH:\*$${Math.floor(filterData[0].usd_market_cap)}

\*Non-filled:\*${nonFilled}
\*filled:\*${filled.length}
\*score:\*${Math.floor((filled.length/filterData.length)*100)}%

\*No socials yet\*

⏲ time elapsed since creation:${formatTimeElapsed(tis,launch.created_timestamp)}
`
await bot.api.sendMessage( channel_id, message, { parse_mode: "Markdown" });
}else{
const message = 
`🌟💊 New Good Creator Creation Detected 💊🌟\n
🏷 \*${launch.name} (${launch.symbol}-sol)\*
\`${launch.tokenAddress}\`

🔍\*Creator:\*[${creator.substring(0,5)}](https://pump.fun/profile/${creator})
💰 \*Market cap:\* $${Math.floor(launch.fdv)}

🌟\*Best Previous:\*${filterData[0].name}
\*ATH:\*$${Math.floor(filterData[0].usd_market_cap)}

\*Non-filled:\*${nonFilled}
\*filled:\*${filled.length}
\*score:\*${Math.floor((filled.length/filterData.length)*100)}%


\*Telegram:\* ${launch.socials.telegram !==  null? launch.socials.telegram:''}
\*Twitter(X):\* ${launch.socials.twitter !==  null? launch.socials.twitter:''}
\*Website:\* ${launch.socials.website !==  null? launch.socials.website:''}

⏲ time elapsed since creation:${formatTimeElapsed(tis,launch.created_timestamp)
}
`
      await bot.api.sendMessage( channel_id, message,{ parse_mode: "Markdown", reply_parameters:{message_id:1}} );
    }
      

  }
 

}


const filterData = async (creator: any) => {
  const filtered_previous: any[] = [];

  try {
    const res = await axios.get(`https://frontend-api.pump.fun/coins/user-created-coins/${creator}?offset=0&limit=50&includeNsfw=false`);
    const previous = res.data;
    const filteredTokens = previous.filter((token: any) => token.usd_market_cap > 100000);

    if (filteredTokens.length !== 0) {
      previous.sort((a: any, b: any) => b.usd_market_cap - a.usd_market_cap);
      const seenAddresses = new Set();

      for (let index = 0; index < previous.length; index++) {
        const token = previous[index];
        if (!seenAddresses.has(token.mint)) {
          filtered_previous.push(token);
          seenAddresses.add(token.mint);
        }
      }
      return filtered_previous;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return false;
  }
}

const startBrowser=async()=>{

  puppeteer.launch({ headless: true }).then(async (browser:any) => {
    console.log('Running tests..');
    const page = await browser.newPage();
    
    await page.setExtraHTTPHeaders(params.xtraheaders);
    await page.setCookie(...params.cookies);
    await page.setRequestInterception(true);

    let apiResponseJson = null;

    page.on('request', (request:any) => {
      if (request.url().includes('/api/discover')) {
        request.continue();
      } else {
        request.continue();
      }
    });

    page.on('response', async (response:any) => {
      if (response.url().includes('/api/discover')) {
        try {
          apiResponseJson = await response.json();
          const topOne=apiResponseJson.data[0]
          if (loggedone !== null){
            if (loggedone.attributes.tokenAddress !== topOne.attributes.tokenAddress){
              loggedone=topOne
              const launch=topOne.attributes
              const other_data:any=await getCoinData(launch.tokenAddress)
              const creator=other_data.creator
              filterData(creator).then(async(filter_arr:any)=>{
                if (filter_arr){
                  await sendtoTg(filter_arr,creator,topOne)
                }
              })
              console.log('scaning...')
              console.log(topOne.attributes.tokenAddress,'\n')
              
            }else{
              console.log('seen')
              console.log(topOne.attributes.tokenAddress,'\n')

            }
          }else{
            loggedone=topOne
            const launch=topOne.attributes
            const other_data:any=await getCoinData(launch.tokenAddress)
            const creator=other_data.creator
            filterData(creator).then(async(filter_arr:any)=>{
              if (filter_arr){
                await sendtoTg(filter_arr,creator,topOne)
              }
            })

          }
    
        } catch (error) {
        console.error('Failed to parse JSON:', error);
          
        }
      }
    })


    const reloadPage = async () => {
      await page.reload();
    };

    await page.goto(url);

   
    const reloadInterval=setInterval(reloadPage, 1000);

    setTimeout(async () => {
      clearInterval(reloadInterval)
      await browser.close();
      startBrowser();
    }, 100000);


  })
}

startBrowser()