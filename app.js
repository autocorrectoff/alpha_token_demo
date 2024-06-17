import { config } from 'dotenv';
import { Wallet, JsonRpcProvider, formatUnits } from 'ethers';
import Erc20 from './contracts/erc20.js';
import Router from './contracts/router.js';
import Factory from './contracts/factory.js';

config();

const alphaAddress = '0x6Fd7c66784508cdE319F80c54fC760C42eC400b7';
const uhuAddress = '0x8d5482c83bb5b49e2b4b97bcf264342eac164c00';
const usdcAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
const usdtAddress = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
const usdceAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

const provider = new JsonRpcProvider(process.env.JSON_RPC_URL);
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

// EXAMPLE: provide liquidity UHU - USDC
(async () => {
  const usdc = new Erc20(wallet, usdcAddress);
  await usdc.init();
  const usdcDecimals = await usdc.getDecimals();
  console.log(`USDC decimals: ${usdcDecimals}`);

  const uhu = new Erc20(wallet, uhuAddress);
  await uhu.init();
  const uhuDecimals = await uhu.getDecimals();
  console.log(`UHU decimals: ${uhuDecimals}`);

  const router = new Router(wallet);
  await router.init();

  const uhuAmount = '5';
  const uhuApproveTx = await uhu.approve(uhuAmount, router.address);
  console.log(uhuApproveTx);

  const usdcAmount = '5';
  const usdcApproveTx = await usdc.approve(usdcAmount, router.address);
  console.log(usdcApproveTx);

  const liquidityInput = {
    token0Address: usdc.address,
    token0Decimals: usdcDecimals,
    token0Amount: usdcAmount,
    token1Address: uhu.address,
    token1Decimals: uhuDecimals,
    token1Amount: uhuAmount,
    to: wallet.address,
    deadline: null,
  };
  const txReceipt = await router.addLiquidity(liquidityInput);
  console.log(txReceipt);
});

// EXAMPLE: provide liquidity UHU - USDT
(async () => {
  const usdt = new Erc20(wallet, usdtAddress);
  await usdt.init();
  const usdtDecimals = await usdt.getDecimals();
  console.log(`USDT decimals: ${usdtDecimals}`);

  const uhu = new Erc20(wallet, uhuAddress);
  await uhu.init();
  const uhuDecimals = await uhu.getDecimals();
  console.log(`UHU decimals: ${uhuDecimals}`);

  const router = new Router(wallet);
  await router.init();

  const uhuAmount = '5';
  const uhuApproveTx = await uhu.approve(uhuAmount, router.address);
  console.log(uhuApproveTx);

  const usdtAmount = '5';
  const usdtApproveTx = await usdt.approve(usdtAmount, router.address);
  console.log(usdtApproveTx);

  const liquidityInput = {
    token0Address: usdt.address,
    token0Decimals: usdtDecimals,
    token0Amount: usdtAmount,
    token1Address: uhu.address,
    token1Decimals: uhuDecimals,
    token1Amount: uhuAmount,
    to: wallet.address,
    deadline: null,
  };
  const txReceipt = await router.addLiquidity(liquidityInput);
  console.log(txReceipt);
});

// EXAMPLE: get liquidity tokens for UHU - USDT
(async () => {
  const factory = new Factory(wallet);
  await factory.init();

  const pairAddress = await factory.getPair(uhuAddress, usdtAddress);
  console.log(`UHU - USDT Pool address: ${pairAddress}`);

  const pair = new Erc20(wallet, pairAddress);
  await pair.init();

  const liquidityTokens = await pair.balanceOf(wallet.address);
  console.log(`Liqidity tokens amount: ${liquidityTokens}`);
});

// EXAMPLE: get liquidity tokens for UHU - USDC
(async () => {
  const factory = new Factory(wallet);
  await factory.init();

  const pairAddress = await factory.getPair(uhuAddress, usdcAddress);
  console.log(`UHU - USDC Pool address: ${pairAddress}`);

  const pair = new Erc20(wallet, pairAddress);
  await pair.init();

  const liquidityTokens = await pair.balanceOf(wallet.address);
  console.log(`Liqidity tokens amount: ${liquidityTokens}`);
});

// EXAMPLE: withdraw liquidity UHU - USDT
(async () => {
  const factory = new Factory(wallet);
  await factory.init();

  const pairAddress = await factory.getPair(uhuAddress, usdtAddress);
  console.log(`UHU - USDT Pool address: ${pairAddress}`);

  const pair = new Erc20(wallet, pairAddress);
  await pair.init();

  const router = new Router(wallet);
  await router.init();

  const liquidityToRemove = '2738612787525';
  const approvalTx = await pair.approve(liquidityToRemove, router.address);
  console.log(approvalTx);

  const liquidityInput = {
    token0Address: usdtAddress,
    token0Decimals: 6,
    token0MinAmount: '1',
    token1Address: uhuAddress,
    token1Decimals: 18,
    token1MinAmount: '1',
    liquidityToRemove,
    to: wallet.address,
    deadline: null,
  };
  const txReceipt = await router.removeLiquidity(liquidityInput);
  console.log(txReceipt);
});

// EXAMPLE: withdraw liquidity UHU - USDC
(async () => {
  const factory = new Factory(wallet);
  await factory.init();

  const pairAddress = await factory.getPair(uhuAddress, usdcAddress);
  console.log(`UHU - USDC Pool address: ${pairAddress}`);

  const pair = new Erc20(wallet, pairAddress);
  await pair.init();

  const router = new Router(wallet);
  await router.init();

  const liquidityToRemove = '';
  const approvalTx = await pair.approve(liquidityToRemove, router.address);
  console.log(approvalTx);

  const liquidityInput = {
    token0Address: usdcAddress,
    token0Decimals: 6,
    token0MinAmount: '1',
    token1Address: uhuAddress,
    token1Decimals: 18,
    token1MinAmount: '1',
    liquidityToRemove,
    to: wallet.address,
    deadline: null,
  };
  const txReceipt = await router.removeLiquidity(liquidityInput);
  console.log(txReceipt);
});

// EXAMPLE: get swap rates - USDC -> UHU
(async () => {
  const router = new Router(wallet);
  await router.init();

  const usdcDecimals = 6;
  const uhuDecimals = 18;

  // get amounts out
  const amountIn = '1';
  let amounts = await router.getAmountsOut(amountIn, usdcDecimals, usdcAddress, uhuAddress);
  console.log(`For ${formatUnits(amounts[0], usdcDecimals)} usdc return is ${formatUnits(amounts[1], uhuDecimals)} uhu`);

  // get amounts in
  const amountOut = '1';
  amounts = await router.getAmountsIn(amountOut, uhuDecimals, usdcAddress, uhuAddress);
  console.log(`${formatUnits(amounts[0], usdcDecimals)} usdc is needed for ${formatUnits(amounts[1], uhuDecimals)} uhu`);
});

// EXAMPLE: get swap rates - UHU -> USDC
(async () => {
  const router = new Router(wallet);
  await router.init();

  const usdcDecimals = 6;
  const uhuDecimals = 18;

  // get amounts out
  const amountIn = '1';
  let amounts = await router.getAmountsOut(amountIn, uhuDecimals, uhuAddress, usdcAddress);
  console.log(`For ${formatUnits(amounts[0], uhuDecimals)} uhu return is ${formatUnits(amounts[1], usdcDecimals)} usdc`);

  // get amounts in
  const amountOut = '1';
  amounts = await router.getAmountsIn(amountOut, usdcDecimals, uhuAddress, usdcAddress);
  console.log(`${formatUnits(amounts[0], uhuDecimals)} uhu is needed for ${formatUnits(amounts[1], usdcDecimals)} usdc`);
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

// EXAMPLE: perform UHU -> USDC swap
(async () => {
  const router = new Router(wallet);
  await router.init();

  const uhuDecimals = 18;

  // get amounts out
  const amountIn = '1';
  let amounts = await router.getAmountsOut(amountIn, uhuDecimals, uhuAddress, usdcAddress);

  // Approve UHU
  const uhu = new Erc20(wallet, uhuAddress);
  await uhu.init();
  const uhuApproveTxReceipt = await uhu.approve(amountIn, router.address);
  console.log(uhuApproveTxReceipt);

  // Swap
  const swapInput = {
    amountIn: amounts[0],
    amountOut: amounts[1],
    inTokenAddress: uhuAddress,
    outTokenAddress: usdcAddress,
    to: wallet.address,
    deadline: null
  }
  const txReceipt = await router.swapExactTokensForTokens(swapInput);
  console.log(txReceipt);
});

// EXAMPLE: perform USDC -> UHU swap
(async () => {
  const router = new Router(wallet);
  await router.init();

  const usdcDecimals = 6;

  // get amounts out
  const amountIn = '1';
  let amounts = await router.getAmountsOut(amountIn, usdcDecimals, usdcAddress, uhuAddress);

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
    outTokenAddress: uhuAddress,
    to: wallet.address,
    deadline: null
  }
  const txReceipt = await router.swapExactTokensForTokens(swapInput);
  console.log(txReceipt);
})();
