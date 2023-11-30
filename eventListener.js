import { config } from 'dotenv';
import { WebSocketProvider } from 'ethers';
import Factory from './contracts/factory.js';
import SwapPair from './contracts/swapPair.js';

config();

const provider = new WebSocketProvider(process.env.JSON_RPC_URL_WSS);
const alphaAddress = '0x6Fd7c66784508cdE319F80c54fC760C42eC400b7';
const usdcAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

(async () => {
    const factory = new Factory(provider);
    await factory.init();

    const pairAddress = await factory.getPair(alphaAddress, usdcAddress);
    console.log(pairAddress);

    const pair = new SwapPair(provider, pairAddress);
    await pair.init();

    const res = await pair.getReserves();
    console.log(res);

    pair.onSwap();
})();