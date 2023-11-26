import { config } from 'dotenv';
import { Wallet, JsonRpcProvider } from 'ethers';
import Erc20 from './contracts/erc20.js';
import Router from './contracts/router.js';

config();

const alphaAddress = '0x6Fd7c66784508cdE319F80c54fC760C42eC400b7';
const usdcAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

const provider = new JsonRpcProvider(process.env.JSON_RPC_URL);
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

// EXAMPLE: provide liquidity
async () => {
  const usdc = new Erc20(wallet, usdcAddress);
  await usdc.init();
  const usdcDecimals = await usdc.getDecimals();
  console.log(`USDC decimals: ${usdcDecimals}`);

  const alpha = new Erc20(wallet, alphaAddress);
  await alpha.init();
  const alphaDecimals = await alpha.getDecimals();
  console.log(`ALPHA decimals: ${alphaDecimals}`);

  const router = new Router(wallet);
  await router.init();

  const alphaAmount = '5';
  const alphaApproveTx = await alpha.approve(alphaAmount, router.address);
  console.log(alphaApproveTx);

  const usdcAmount = '5';
  const usdcApproveTx = await usdc.approve(usdcAmount, router.address);
  console.log(usdcApproveTx);

  const liquidityInput = {
    token0Address: usdc.address,
    token0Decimals: usdcDecimals,
    token0Amount: usdcAmount,
    token0MinAmount: usdcAmount,
    token1Address: alpha.address,
    token1Decimals: alphaDecimals,
    token1Amount: alphaAmount,
    token1MinAmount: alphaAmount,
    to: wallet.address,
    deadline: null,
  };
  const txReceipt = await router.addLiquidity(liquidityInput);
  console.log(txReceipt);
};
