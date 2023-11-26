import { Contract, parseUnits } from 'ethers';
import { readFile } from 'fs/promises';

export default class Erc20 {
  constructor(provider, address) {
    this.provider = provider;
    this.address = address;
  }

  async init() {
    const erc20AbiStr = await readFile('./abi/erc20.json', 'utf-8');
    const erc20Abi = JSON.parse(erc20AbiStr);
    this.contract = new Contract(this.address, erc20Abi, this.provider);
  }

  async getDecimals() {
    return +(await this.contract.decimals()).toString();
  }

  async approve(amount, to) {
    const decimals = await this.getDecimals();
    amount = parseUnits(amount, decimals);
    const tx = await this.contract.approve(to, amount);
    return tx.wait(1);
  }
}
