import puppeteer from "puppeteer";
import axios from "axios";
import { Connection, PublicKey } from '@solana/web3.js';
import { Bot } from "grammy";
import { getCoinData } from "./api";
import express from 'express'

const url_endpoint = 'https://frontend-api.pump.fun/trades/latest';
const connection = new Connection('https://api.mainnet-beta.solana.com');
const bot_token = "7351592175:AAHRKoYsnrMIEKM_qbw4BTFc6UCiajZl0TQ";
const bot = new Bot(bot_token);
const channel_id ='-1002214628234';
let current_latest:any = '';
let isRateLimited = false;
let retryAfter = 1500; // Default retry time
let arr_sent: any[] =[]
const port = process.env.PORT || 10000;  // Use environment variable for port
const app=express()


const createTelegramMessage=(data:any)=> {
// Initialize an array to hold the formatted lines
let messageLines:string= '';
// Initialize a temporary array to collect groups of three entries
let topten: Number=0

let Bonding_curve:Number=0
// Iterate over the data array
data.forEach((entry:any, index:number) => {
    // Format the percentage and create the link
    let percentage = entry.percentage.toFixed(2) + '%';
    let link = `[${percentage}](https://pump.fun/profile/${entry.address})`;
    
  
    // Every three entries, join them into a single line and push to messageLines
    if ((index + 1) < 11){
        topten+=entry.percentage
        if ((index + 1) % 4 === 0 && index !== 1) {
            if(entry.name !== undefined){
                if (entry.name === 'Dev') {
                    messageLines+=link+'(Dev) |\n'
                }else if(entry.name === 'Bonding Curve'){
                    Bonding_curve=entry.percentage
                }
                    
                
            }else{
                messageLines+=link+' |\n'

            }
    
        }else{
            if(entry.name !== undefined){
                if (entry.name === 'Dev') {
                    messageLines+=link+'(Dev) |'
                }else if(entry.name === 'Bonding Curve'){
                    Bonding_curve+=entry.percentage
                }
                    
                
            }else{
                messageLines+=link+' |'

            }
        }
    }else{
        if ((index + 1) % 4 === 0 && (index + 1) !== 1) {
            if(entry.name !== undefined){
                if (entry.name === 'Dev') {
                    messageLines+=link+'(Dev) |\n'
                }else if(entry.name === 'Bonding Curve'){
                    Bonding_curve=entry.percentage
                }
                    
                
            }else{
                messageLines+=link+' |\n'

            }
    
        }else{
            if(entry.name !== undefined){
                if (entry.name === 'Dev') {
                    messageLines+=link+'(Dev) |'
                }else if(entry.name === 'Bonding Curve'){
                    Bonding_curve+=entry.percentage
                }
                    
                
            }else{
                messageLines+=link+'|'

            }
        }
    }
 
});

// Join all lines into a single message string
return [messageLines.replace('|', '\|'),topten,Bonding_curve]
}



async function getBalance(walletAddress:PublicKey) {
    try {
      // Fetch balance in lamports
      const balance:any =await connection.getBalance(walletAddress);
  
      const solBalance =balance/1000000000;
      return solBalance.toFixed(4)
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
}

function formatTimeElapsed(currentTimeInSeconds:number, previousTimeInSeconds:number) {
    var elapsedTime = currentTimeInSeconds - previousTimeInSeconds;
    
    var hours = Math.floor(elapsedTime / 3600);
    var minutes = Math.floor((elapsedTime % 3600) / 60);
    var seconds = Math.floor(elapsedTime % 60);
    
    var formattedTime = hours + "hr " + minutes + "min " + seconds + "sec";
    return formattedTime;
}

const sendtoTg = async (data:any,holders_data:any) => {
    const launch = await getCoinData(data.mint);
    let perce:any=''
    let balance:any=await getBalance(new PublicKey(data.user))
    if (holders_data !== null) {
        perce=createTelegramMessage(holders_data)
    } 
    const now = new Date();

    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    const tis=Date.now()/1000

    const time_five_min=arr_sent.filter((buy)=>{
        if(buy.address === data.mint && (Number(tis) - buy.time) < 300 ){
            return true
        }
    })

    const time_one_hr=arr_sent.filter((buy)=>{
        if(buy.address === data.mint && (Number(tis) - buy.time) < 3600 ){
            return true
        }
    })

    const time_six_hr=arr_sent.filter((buy)=>{
        if(buy.address === data.mint && (Number(tis) - buy.time) < 3600*6 ){
            return true
        }
    })

    const time_tf_hr=arr_sent.filter((buy)=>{
        if(buy.address === data.mint && (Number(tis) - buy.time) < 3600*24 ){
            return true
        }
    })

    arr_sent.push({address:data.mint, time:tis})


let message = `🌟💊 FRESH WALLET BUY Detected 💊🌟\n
🏷 *${launch.name} (${launch.symbol}-sol)*
\`${launch.mint}\`

[${data.user.substring(0,7)}](https://pump.fun/profile/${data.user}) *BOUGHT ${data.sol_amount / 1000000000} SOL*
user wallet balance: ${(balance-Number((data.sol_amount / 1000000000).toFixed(4))).toFixed(2)} sol

Fresh Wallet Stats:
5min: ${time_five_min.length + 1} 1h: ${time_one_hr.length + 1} 6h: ${time_six_hr.length + 1}  24h: ${time_tf_hr.length + 1}

🔍*Creator:* [${launch.creator.substring(0,7)}](https://pump.fun/profile/${launch.creator})
💰 *Market cap:* $${Math.floor(launch.usd_market_cap)}

*Telegram:* ${launch.telegram !== null ? launch.telegram : 'Not found'}
*Twitter:* ${launch.twitter !== null ? launch.twitter : 'Not found'}
*Website:* ${launch.website !== null ? launch.website : 'Not found'}

Bonding Curve: ${Math.floor(perce[2])}% | Top 10 holds: ${Math.floor(perce[1])}%

${
perce[0]
}

⏲ time elapsed :${formatTimeElapsed(tis,(launch.created_timestamp/1000))}

[pumpfun |](https://pump.fun/${launch.mint}) [Photon |](https://photon-sol.tinyastro.io/en/lp/${launch.mint}?handle=413366f37f1bc7eef9bd0) [Bonk |](https://t.me/bonkbot_bot?start=ref_p8tvh_ca_${launch.mint})
`;
    await bot.api.sendMessage(channel_id, message, { parse_mode: "Markdown", reply_parameters:{message_id:191} });
};



const start = async (latest:any) => {
    try {
        if (latest !== current_latest) {
            current_latest = latest;
            console.log(current_latest.user, current_latest.token_amount, latest.user, latest.token_amount)
            if (latest.is_buy && (latest.sol_amount / 1000000000) > 2) {
             
                const transactions = await connection.getConfirmedSignaturesForAddress2(new PublicKey(latest.user));
                console.log(transactions.length, '\n');
                if (transactions.length < 4) {
                    const endpoint_holders = `https://europe-west1-cryptos-tools.cloudfunctions.net/get-bubble-graph-data?token=${latest.mint}&chain=sol&pumpfun=true`;
                    try {
                        const holders_data = await axios.get(endpoint_holders);
                        await sendtoTg(latest,holders_data.data.nodes);

                        
                    } catch (error) {
                        await sendtoTg(latest, null);

                    }
                }
            }
        } else {
            console.log('seen', '\n');
        }
    } catch (error) {
        console.error(error);
    }
};





async function listenForWSMessages() {
    const browser = await puppeteer.launch();
    const page = (await browser.pages())[0];

    // Create CDP session and enable domains
    const f12 = await page.target().createCDPSession();
    await f12.send('Network.enable');
    await f12.send('Page.enable');
    let amount= 0
    // Function to handle incoming WebSocket messages
    const handleWebSocketFrameReceived =async (params:any) => {
        try {
            amount+=1

            if (amount>3){
            const payloadData:string = params.response.payloadData;
            const jsonData = JSON.parse(payloadData.substring(2)); // Remove the leading "42["
            await start(jsonData[1]);
            }
    
        }catch (error) {
            console.log(error)
        }
   

        // Process the decoded message data further (if needed)
    };

    // Listen for WebSocket frames
    f12.on('Network.webSocketFrameReceived', handleWebSocketFrameReceived);

    // Navigate to the target site (or trigger action that opens the websocket)
    await page.goto('https://www.pump.fun'); // Replace with the actual site URL

    // Wait for some time to allow messages to arrive (adjust as needed)
    await new Promise(resolve => setTimeout(resolve, 5000));

}

listenForWSMessages()
