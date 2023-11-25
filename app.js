import { config } from 'dotenv';
import { Wallet, JsonRpcProvider } from 'ethers';
import USDC from './contracts/usdc.js';
import Alpha from './contracts/alpha.js';
import Router from './contracts/router.js';

config();

(async () => {
  const provider = new JsonRpcProvider(process.env.JSON_RPC_URL);
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

  const blockNumber = await provider.getBlockNumber();
  console.log(blockNumber);

  const usdc = new USDC(wallet);
  await usdc.init();
  const usdcDecimals = await usdc.getDecimals();
  console.log(`USDC decimals: ${usdcDecimals}`);

  const alpha = new Alpha(wallet);
  await alpha.init();
  const alphaDecimals = await alpha.getDecimals();
  console.log(`ALPHA decimals: ${alphaDecimals}`);

  const router = new Router(wallet);
  await router.init();
  const factory = await router.getFactoryAddress();
  console.log(`Factory address: ${factory}`);
})();
