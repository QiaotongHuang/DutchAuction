import '@nomiclabs/hardhat-waffle';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task('deploy', 'Deploy BasicDutchAuction contract').setAction(
    async (_, hre: HardhatRuntimeEnvironment): Promise<void> => {
        const factory = await hre.ethers.getContractFactory('BasicDutchAuction');
        const BasicDutchAuction = await factory.deploy(2000, 5, 1000);

        await BasicDutchAuction.deployed();

        console.log('BasicDutchAuction deployed to:', BasicDutchAuction.address);
    }
);
