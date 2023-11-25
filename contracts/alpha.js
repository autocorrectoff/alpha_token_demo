import { Contract } from 'ethers';
import { readFile } from 'fs/promises';

export default class Alpha {
  constructor(provider) {
    this.provider = provider;
    this.address = '0x6Fd7c66784508cdE319F80c54fC760C42eC400b7';
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
