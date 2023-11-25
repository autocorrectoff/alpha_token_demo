import { Contract } from 'ethers';
import { readFile } from 'fs/promises';

export default class USDC {
  constructor(provider) {
    this.provider = provider;
    this.address = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
  }

  async init() {
    const erc20AbiStr = await readFile('./abi/erc20.json', 'utf-8');
    const erc20Abi = JSON.parse(erc20AbiStr);
    this.contract = new Contract(this.address, erc20Abi, this.provider);
  }

  async getDecimals() {
    return +(await this.contract.decimals()).toString();
  }
}
