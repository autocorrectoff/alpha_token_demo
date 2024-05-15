import { config } from 'dotenv';
import { Wallet, JsonRpcProvider, formatUnits } from 'ethers';
import Erc20 from './contracts/erc20.js';
import Router from './contracts/router.js';
import Factory from './contracts/factory.js';

config();

const alphaAddress = '0x6Fd7c66784508cdE319F80c54fC760C42eC400b7';
const usdcAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
const usdtAddress = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
const usdceAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

const provider = new JsonRpcProvider(process.env.JSON_RPC_URL);
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

// EXAMPLE: provide liquidity
(async () => {
  const usdt = new Erc20(wallet, usdtAddress);
  await usdt.init();
  const usdtDecimals = await usdt.getDecimals();
  console.log(`USDT decimals: ${usdtDecimals}`);

  const alpha = new Erc20(wallet, alphaAddress);
  await alpha.init();
  const alphaDecimals = await alpha.getDecimals();
  console.log(`ALPHA decimals: ${alphaDecimals}`);

  const router = new Router(wallet);
  await router.init();

  const alphaAmount = '15';
  const alphaApproveTx = await alpha.approve(alphaAmount, router.address);
  console.log(alphaApproveTx);

  const usdtAmount = '15';
  const usdtApproveTx = await usdt.approve(usdtAmount, router.address);
  console.log(usdtApproveTx);

  const liquidityInput = {
    token0Address: usdt.address,
    token0Decimals: usdtDecimals,
    token0Amount: usdtAmount,
    token0MinAmount: usdtAmount,
    token1Address: alpha.address,
    token1Decimals: alphaDecimals,
    token1Amount: alphaAmount,
    token1MinAmount: alphaAmount,
    to: wallet.address,
    deadline: null,
  };
  const txReceipt = await router.addLiquidity(liquidityInput);
  console.log(txReceipt);
})();

// EXAMPLE: get liquidity tokens
(async() => {
  const factory = new Factory(wallet);
  await factory.init();

  const pairAddress = await factory.getPair(alphaAddress, usdtAddress);
  console.log(`ALPHA - USDT Pool address: ${pairAddress}`);

  const pair = new Erc20(wallet, pairAddress);
  await pair.init();

  const liquidityTokens = await pair.balanceOf(wallet.address);
  console.log(`Liqidity tokens amount: ${liquidityTokens}`);
});

// EXAMPLE: withdraw liquidity
(async () => {
  const factory = new Factory(wallet);
  await factory.init();

  const pairAddress = await factory.getPair(alphaAddress, usdtAddress);
  console.log(`ALPHA - USDT Pool address: ${pairAddress}`);

  const pair = new Erc20(wallet, pairAddress);
  await pair.init();

  const router = new Router(wallet);
  await router.init();

  const liquidityToRemove = '30000000000000';
  const approvalTx = await pair.approve(liquidityToRemove, router.address);
  console.log(approvalTx);

  const liquidityInput = {
    token0Address: usdtAddress,
    token0Decimals: 6,
    token0MinAmount: '1',
    token1Address: alphaAddress,
    token1Decimals: 18,
    token1MinAmount: '1',
    liquidityToRemove,
    to: wallet.address,
    deadline: null,
  };
  const txReceipt = await router.removeLiquidity(liquidityInput);
  console.log(txReceipt);
});

// EXAMPLE: get swap rates - USDC -> ALPHA
(async () => {
  const router = new Router(wallet);
  await router.init();

  const usdcDecimals = 6;
  const alphaDecimals = 18;

  // get amounts out
  const amountIn = '2';
  let amounts = await router.getAmountsOut(amountIn, usdcDecimals, usdcAddress, alphaAddress);
  console.log(`For ${formatUnits(amounts[0], usdcDecimals)} usdc return is ${formatUnits(amounts[1], alphaDecimals)} alpha`);

  // get amounts in
  const amountOut = '2';
  amounts = await router.getAmountsIn(amountOut, alphaDecimals, usdcAddress, alphaAddress);
  console.log(`${formatUnits(amounts[0], usdcDecimals)} usdc is needed for ${formatUnits(amounts[1], alphaDecimals)} alpha`);
});

// EXAMPLE: get swap rates - ALPHA -> USDC
(async () => {
  const router = new Router(wallet);
  await router.init();

  const usdcDecimals = 6;
  const alphaDecimals = 18;

  // get amounts out
  const amountIn = '2';
  let amounts = await router.getAmountsOut(amountIn, alphaDecimals, alphaAddress, usdcAddress);
  console.log(`For ${formatUnits(amounts[0], alphaDecimals)} alpha return is ${formatUnits(amounts[1], usdcDecimals)} usdc`);

  // get amounts in
  const amountOut = '2';
  amounts = await router.getAmountsIn(amountOut, usdcDecimals, alphaAddress, usdcAddress);
  console.log(`${formatUnits(amounts[0], alphaDecimals)} alpha is needed for ${formatUnits(amounts[1], usdcDecimals)} usdc`);
});

// EXAMPLE: perform USDC -> ALPHA swap
(async () => {
  const router = new Router(wallet);
  await router.init();

  const usdcDecimals = 6;

    // get amounts out
    const amountIn = '1';
    let amounts = await router.getAmountsOut(amountIn, usdcDecimals, usdcAddress, alphaAddress);

    // Approve USDC
    const usdc = new Erc20(wallet, usdcAddress);
    await usdc.init();
    const usdcApproveTxReceipt = await usdc.approve(amountIn, router.address);
    console.log(usdcApproveTxReceipt);

    // Swap
    const swapInput = {
      amountIn: amounts[0],
      amountOut: amounts[1],
      inTokenAddress: usdcAddress,
      outTokenAddress: alphaAddress,
      to: wallet.address,
      deadline: null
    }
    const txReceipt = await router.swapExactTokensForTokens(swapInput);
    console.log(txReceipt);
});

// EXAMPLE: perform ALPHA -> USDC swap
(async () => {
  const router = new Router(wallet);
  await router.init();

  const alphaDecimals = 18;

    // get amounts out
    const amountIn = '1';
    let amounts = await router.getAmountsOut(amountIn, alphaDecimals, alphaAddress, usdcAddress);

    // Approve ALPHA
    const alpha = new Erc20(wallet, alphaAddress);
    await alpha.init();
    const alphaApproveTxReceipt = await alpha.approve(amountIn, router.address);
    console.log(alphaApproveTxReceipt);

    // Swap
    const swapInput = {
      amountIn: amounts[0],
      amountOut: amounts[1],
      inTokenAddress: alphaAddress,
      outTokenAddress: usdcAddress,
      to: wallet.address,
      deadline: null
    }
    const txReceipt = await router.swapExactTokensForTokens(swapInput);
    console.log(txReceipt);
});
