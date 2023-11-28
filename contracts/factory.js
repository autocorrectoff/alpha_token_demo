import { Contract } from 'ethers';
import { readFile } from 'fs/promises';

export default class Factory {
  constructor(provider) {
    this.provider = provider;
    this.address = '0x24Df3e38c7bf83B91c1A1F940eBfD9E6c2D59604';
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
