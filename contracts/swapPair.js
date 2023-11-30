
import { Contract } from 'ethers';
import { readFile } from 'fs/promises';

export default class SwapPair {
    constructor(provider, address) {
        this.provider = provider;
        this.address = address;
    }

    async init() {
        const swapPairAbiStr = await readFile('./abi/swapPair.json', 'utf-8');
        const swapPairAbi = JSON.parse(swapPairAbiStr);
        this.contract = new Contract(this.address, swapPairAbi, this.provider);
    }

    getReserves() {
        return this.contract.getReserves();
    }

    onSwap() {
        this.contract.on("Swap", (senderAddress, amount0In, amount1In, amount0Out, amount1Out, toAddress) => {
            console.log("Sender: " + senderAddress);
            console.log("Amount0In: " + amount0In);
            console.log("Amount1In: " + amount1In);
            console.log("Amount0Out: " + amount0Out);
            console.log("Amount1Out: " + amount1Out);
            console.log("To: " + toAddress);
        });
    }
}