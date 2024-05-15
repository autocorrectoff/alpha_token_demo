import { Contract, parseUnits } from 'ethers';
import { readFile } from 'fs/promises';

export default class Router {
  constructor(provider) {
    this.provider = provider;
    this.address = '0x03f81D7199633Ec31175D0A641080f8ccFDa4280';
  }

  async init() {
    const routerAbiStr = await readFile('./abi/router.json', 'utf-8');
    const routerAbi = JSON.parse(routerAbiStr);
    this.contract = new Contract(this.address, routerAbi, this.provider);
  }

  getFactoryAddress() {
    return this.contract.factory();
  }

  async addLiquidity(data) {
    const deadline = data?.deadline ? data.deadline : Math.floor(new Date().getTime() / 1000) + 10 * 60;
    const token0Amount = parseUnits(data.token0Amount, data.token0Decimals);
    const token1Amount = parseUnits(data.token1Amount, data.token1Decimals);
    const token0MinAmount = parseUnits(data.token0MinAmount, data.token0Decimals);
    const token1MinAmount = parseUnits(data.token1MinAmount, data.token1Decimals);

    const gasEstimate = await this.contract.addLiquidity.estimateGas(
      data.token0Address,
      data.token1Address,
      token0Amount,
      token1Amount,
      token0MinAmount,
      token1MinAmount,
      data.to,
      deadline,
    );

    const tx = await this.contract.addLiquidity(
      data.token0Address,
      data.token1Address,
      token0Amount,
      token1Amount,
      token0MinAmount,
      token1MinAmount,
      data.to,
      deadline,
      { gasLimit: gasEstimate },
    );

    return tx.wait(1);
  }

  async removeLiquidity(data) {
    const deadline = data?.deadline ? data.deadline : Math.floor(new Date().getTime() / 1000) + 10 * 60;
    const token0MinAmount = parseUnits(data.token0MinAmount, data.token0Decimals);
    const token1MinAmount = parseUnits(data.token1MinAmount, data.token1Decimals);

    const tx = await this.contract.removeLiquidity(
      data.token0Address,
      data.token1Address,
      data.liquidityToRemove,
      token0MinAmount,
      token1MinAmount,
      data.to,
      deadline,
    );
    return tx.wait(1);
  }

  getAmountsOut(amountIn, inTokenDecimals, inTokenAddress, outTokenAddress) {
    amountIn = parseUnits(amountIn, inTokenDecimals);
    return this.contract.getAmountsOut(amountIn, [inTokenAddress, outTokenAddress]);
  }

  getAmountsIn(amountOut, outTokenDecimals, inTokenAddress, outTokenAddress) {
    amountOut = parseUnits(amountOut, outTokenDecimals);
    return this.contract.getAmountsIn(amountOut, [inTokenAddress, outTokenAddress]);
  }

  async swapExactTokensForTokens(data) {
    const deadline = data?.deadline ? data.deadline : Math.floor(new Date().getTime() / 1000) + 10 * 60;
    const tx = await this.contract.swapExactTokensForTokens(data.amountIn, data.amountOut, [data.inTokenAddress, data.outTokenAddress], data.to, deadline);
    return tx.wait(1);
  }
}
