import { Contract } from 'ethers';
import { readFile } from 'fs/promises';

export default class Factory {
  constructor(provider) {
    this.provider = provider;
    this.address = '0x2FCAdC83035C4fb3a271386203cce02Eb9AFAfd9';
  }

  async init() {
    const factoryAbiStr = await readFile('./abi/factory.json', 'utf-8');
    const factoryAbi = JSON.parse(factoryAbiStr);
    this.contract = new Contract(this.address, factoryAbi, this.provider);
  }

  getPair(token0Address, token1Address) {
    return this.contract.getPair(token0Address, token1Address);
  }
}
