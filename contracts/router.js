import { Contract, parseUnits } from 'ethers';
import { readFile } from 'fs/promises';

export default class Router {
  constructor(provider) {
    this.provider = provider;
    this.address = '0x8F2DdC83ea0a7329AD463C3a7838787A2ba984CD';
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
}
