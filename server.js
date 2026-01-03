const https = require("https");

function get(url){
  return new Promise((resolve)=>{
    https.get(url,res=>{
      let data="";
      res.on("data",d=>data+=d);
      res.on("end",()=>resolve(JSON.parse(data)));
    });
  });
}

async function prices(){
  const binance = await get("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");
  const okx = await get("https://www.okx.com/api/v5/market/ticker?instId=ETH-USDT");

  return {
    binance: binance.price,
    okx: okx.data[0].last,
    diff: (okx.data[0].last - binance.price).toFixed(2)
  };
}

require("http").createServer(async (req,res)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.end(JSON.stringify(await prices()));
}).listen(3000);

console.log("Server running on port 3000");
