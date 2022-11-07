import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import hre from "hardhat";

describe("Storage", function () {
  async function deployStorage() {
    // Contracts are deployed using the first signer/account by default
    const account = await ethers.getSigners();

    const Storage = await ethers.getContractFactory("Storage");
    const storage = await Storage.deploy();

    return { storage, account };
  }

  describe("getStorageAt", function () {
    it("slot_0", async function () {
      const { storage } = await loadFixture(deployStorage);
      const data = await hre.ethers.provider.getStorageAt(storage.address, 0x0);

      expect(data).to.equal("0x00000000000000000000000000000000000000000000000000000000000000ff");
    });

    it("slot_1", async function () {
      const { storage } = await loadFixture(deployStorage);
      const data = await hre.ethers.provider.getStorageAt(storage.address, 0x1);

      expect(data).to.equal("0x000000000000000000000000000000000000000000000000000000000000dead");
    });

    it("slot_2", async function () {
        const { storage } = await loadFixture(deployStorage);
        const data = await hre.ethers.provider.getStorageAt(storage.address, 0x2);
  
        expect(data).to.equal("0x000000000000000000000000000000000000000000000000000000000000beef");
    });

    it("slot_3", async function () {
        const { storage, account } = await loadFixture(deployStorage);
        storage.set(1, account[0].address, [account[1].address,account[2].address]); // set method
        const data = await hre.ethers.provider.getStorageAt(storage.address, 0x3); 
        // will be 0x0 because 0x3 not the real storage slot

        expect(data).to.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
    });

    it("slot_3 bybass", async function () {
        const { storage, account } = await loadFixture(deployStorage);
        storage.set(1, account[0].address, [account[1].address,account[2].address]); // set method

        const slot = (key:number, index:number) => {
            return ethers.utils.solidityKeccak256(
                ["uint256","uint256"], // key, slot id
                [key, index]
            )
        }

        const hash = (key:BigNumber) => {
            return ethers.utils.solidityKeccak256(
                ["uint256"],
                [key]
            )
        }

        const hashed = hash(BigNumber.from(slot(1,3)).add(1));
        
        const var1 = await hre.ethers.provider.getStorageAt(storage.address,slot(1,3)); // mapping(uint(key) => struct)
        const var2_length = await hre.ethers.provider.getStorageAt(storage.address,BigNumber.from(slot(1,3)).add(1)); // elementSize
        const var2_0 = await hre.ethers.provider.getStorageAt(storage.address,BigNumber.from(hashed).add(0));
        const var2_1 = await hre.ethers.provider.getStorageAt(storage.address,BigNumber.from(hashed).add(1));

        expect(var1).to.equal("0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266");
        expect(var2_length).to.equal("0x0000000000000000000000000000000000000000000000000000000000000002");
        expect(var2_0).to.equal("0x00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8");
        expect(var2_1).to.equal("0x0000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc");

    });
  });
});
