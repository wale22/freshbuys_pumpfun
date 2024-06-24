import { getCoinData } from "./api";
import { params } from "./param";
import { Bot,InlineKeyboard } from "grammy";

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const bot_token = "7351592175:AAHRKoYsnrMIEKM_qbw4BTFc6UCiajZl0TQ";
const bot = new Bot(bot_token);
const channel_id ='-1002214628234';

puppeteer.use(StealthPlugin());
const url = `https://photon-sol.tinyastro.io/api/discover/search?buys_from=&buys_to=&dexes=pump&freeze_authority=false&lp_burned_perc=false&mint_authority=false&mkt_cap_from=10000&mkt_cap_to=20000&one_social=false&order_by=created_at&order_dir=desc&sells_from=&sells_to=&top_holders_perc=false&txns_from=&txns_to=&usd_liq_from=&usd_liq_to=&volume_from=&volume_to=`;
const loggedArr:any =[]

const MAX_HISTORY_SIZE=20

function addToArrSent(data:any) {
  if (loggedArr.length >= MAX_HISTORY_SIZE) {
    loggedArr.shift(); // Remove oldest item
  }
  loggedArr.push(data);
}


const sendtoTg=async(other_data:any, launch:any,time_diff:Number)=>{
  const message = 
`💊 New Banger Detected 💊\n
🏷 \*${launch.name} (${launch.symbol}-sol)\*
\`${launch.tokenAddress}\`

\*Total Supply:\* ${other_data.total_supply}
\*Market cap:\* $${Math.floor(launch.fdv)}
\*Volume:\* $${Math.floor(launch.volume)}
\*Top 10 holders:\*${Math.round(launch.audit.top_holders_perc)}%
\*Creator:\*[${other_data.creator.substring(0,5)}](https://solscan.io/account/${other_data.creator})
\*buys:\* ${launch.buys_count} | \*sell:\* ${launch.sells_count}


\*Telegram:\* ${launch.socials.telegram? launch.socials.telegram:''}
\*Twitter(X):\* ${launch.socials.twitter? launch.socials.twitter:''}
\*Website:\* ${launch.socials.website? launch.socials.website:''}

\_Token deployed ${time_diff} seconds ago\_

[pumpfun |](https://pump.fun/${launch.tokenAddress}) [Photon |](https://photon-sol.tinyastro.io/en/lp/${launch.tokenAddress}?handle=413366f37f1bc7eef9bd0) [Bonk |](https://t.me/bonkbot_bot?start=ref_p8tvh_ca_${launch.tokenAddress})

`
await bot.api.sendMessage( channel_id, message, { parse_mode: "Markdown", reply_parameters:{message_id:419}} );

}


const startBrowser=async()=>{
  puppeteer.launch({ headless: true,args: ['--no-sandbox']}).then(async (browser:any) => {
    console.log('Running tests..');
    const page = await browser.newPage();
    
    await page.setExtraHTTPHeaders(params.xtraheaders);
    await page.setCookie(...params.cookies);
    await page.setRequestInterception(true);

    let apiResponseJson = null;

    page.on('request', (request:any) => {
      if (request.url().includes('/api/discover/search')) {
        request.continue();
      } else {
        request.continue();
      }
    });

    page.on('response', async (response:any) => {
      if (response.url().includes('/api/discover/search')) {
        try {
          apiResponseJson = await response.json();
          const topThree=apiResponseJson.data.slice(0,3)
          let currentTimeInSeconds = Math.floor(Date.now() / 1000);

          for (let i = 0; i < 3 && i < topThree.length; i++) {            
            
            if (!loggedArr.includes(topThree[i].attributes.tokenAddress)){
              addToArrSent(topThree[i].attributes.tokenAddress)
              const launch=topThree[i].attributes
              console.log('scanning',currentTimeInSeconds,launch.created_timestamp)

              const time_diff=currentTimeInSeconds-launch.created_timestamp
              console.log(time_diff)

              if (time_diff<params.time_max) {
                console.log(time_diff)

                const other_data=await getCoinData(launch.tokenAddress)
                await sendtoTg(other_data,launch,time_diff)

                console.log(topThree[i])
              }

            }else{
              console.log('seen')
              
            }
            
          }
        } catch (error) {
        console.error('Failed to parse JSON:');
      }
      }
    });


    const reloadPage = async () => {
      await page.reload();
    };

    await page.goto(url);

    const reloadInterval=setInterval(reloadPage, 3000);

    setTimeout(async () => {
      clearInterval(reloadInterval)
      await browser.close();
      startBrowser();
    }, 150000);

  });

}


startBrowser()