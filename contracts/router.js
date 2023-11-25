import { Contract } from 'ethers';
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
}
