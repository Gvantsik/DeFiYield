import { Injectable } from '@nestjs/common';
import { Alchemy, Network } from 'alchemy-sdk';
import fs from 'fs';
import Web3 from 'web3';

@Injectable()
export class AppService {
  getBalances() {
    const config = {
      apiKey: 'SfCYv2oVevSKfLwzasNySlYw79AQLaiW',
      network: Network.ETH_MAINNET,
    };
    const alchemy = new Alchemy(config);
    let res: string;
    const contracts = [];
    const main = async () => {
      // Wallet address
      const address = process.env.ADDRESS;

      // Get token balances
      const balances = await alchemy.core.getTokenBalances(address);
      // Remove tokens with zero balance
      const nonZeroBalances = balances.tokenBalances.filter((token) => {
        return token.tokenBalance !== '0';
      });
      console.log(`Token balances of ${address} \n`);

      // Counter for number of final output
      let i = 1;

      // Loop through all tokens with non-zero balance
      for (const token of nonZeroBalances) {
        // Get balance of token
        let balance = Number(token.tokenBalance);

        // Get metadata of token
        const metadata = await alchemy.core.getTokenMetadata(
          token.contractAddress,
        );

        // Compute token balance in human-readable format
        balance = balance / Math.pow(10, metadata.decimals);

        // Print name, balance, and symbol of token
        contracts.push(
          `${i++}. ${metadata.name}: ${balance} ${metadata.symbol}`,
        );
        // Print wallet balance
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.URL));
        const Wbalance = await web3.eth.getBalance(
          process.env.ADDRESS,
          'latest',
        );
        res = web3.utils.fromWei(Wbalance, 'ether');
        fs.writeFileSync(
          'result',
          `Wallet Balance: ${res}, \nContracts ${JSON.stringify(contracts)
            .split(',')
            .join('\r\n')} \nfetched at: ${new Date()}`,
        );
      }
    };

    const runMain = async () => {
      try {
        await main();
        process.exit(0);
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
    };

    runMain();
  }
}
