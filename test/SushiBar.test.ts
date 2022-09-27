import { ethers } from "hardhat";
import hre from "hardhat";
import { expect } from "chai";

describe("SushiBar", function () {
  before(async function () {
    this.SushiToken = await ethers.getContractFactory("SushiToken")
    this.SushiBar = await ethers.getContractFactory("SushiBar")

    this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.bob = this.signers[1]
    this.carol = this.signers[2]
    
  })

  beforeEach(async function () {
    this.sushi = await this.SushiToken.deploy()
    this.bar = await this.SushiBar.deploy(this.sushi.address)
    this.sushi.mint(this.alice.address, "100")
    this.sushi.mint(this.bob.address, "100")
    this.sushi.mint(this.carol.address, "100")
  })

  it("should not allow enter if not enough approve", async function () {
    await expect(this.bar.enter("100")).to.be.revertedWith("ERC20: transfer amount exceeds allowance")
    await this.sushi.approve(this.bar.address, "50")
    await expect(this.bar.enter("100")).to.be.revertedWith("ERC20: transfer amount exceeds allowance")
    await this.sushi.approve(this.bar.address, "100")
    await this.bar.enter("100")
    expect(await this.bar.balanceOf(this.alice.address)).to.equal("100")
  })

  it("should not allow withraw more than what you have", async function () {
    await this.sushi.approve(this.bar.address, "100")
    await this.bar.enter("100")
    const SECONDS_IN_ONE_DAY = 86400

    // Increase the time period of neext block
    await hre.network.provider.send("evm_increaseTime", [10*SECONDS_IN_ONE_DAY])
    await hre.network.provider.send("evm_mine")
    await expect(this.bar.leave("200", "0")).to.be.revertedWith("Amount deposited is less than share requested")
  })

  it("should work with more than one participant", async function () {
    await this.sushi.approve(this.bar.address, "100")
    await this.sushi.connect(this.bob).approve(this.bar.address, "100", { from: this.bob.address })
    // Alice enters and gets 20 shares. Bob enters and gets 10 shares.
    await this.bar.enter("20")
    await this.bar.connect(this.bob).enter("10", { from: this.bob.address })
    expect(await this.bar.balanceOf(this.alice.address)).to.equal("20")
    expect(await this.bar.balanceOf(this.bob.address)).to.equal("10")
    expect(await this.sushi.balanceOf(this.bar.address)).to.equal("30")
    // SushiBar get 20 more SUSHIs from an external source.
    await this.sushi.connect(this.carol).transfer(this.bar.address, "20", { from: this.carol.address })
    // Alice deposits 10 more SUSHIs. She should receive 10*30/50 = 6 shares.
    await this.bar.enter("10")
    expect(await this.bar.balanceOf(this.alice.address)).to.equal("26")
    expect(await this.bar.balanceOf(this.bob.address)).to.equal("10")
    // Bob withdraws 5 shares. He should receive 5*60/36 = 8 shares
    
    const SECONDS_IN_ONE_DAY = 86400

    // Increase the time period of neext block
    await hre.network.provider.send("evm_increaseTime", [10*SECONDS_IN_ONE_DAY])
    await hre.network.provider.send("evm_mine")

    await this.bar.connect(this.bob).leave("5", "1", { from: this.bob.address })
    expect(await this.bar.balanceOf(this.alice.address)).to.equal("26")
    expect(await this.bar.balanceOf(this.bob.address)).to.equal("5")
    expect(await this.sushi.balanceOf(this.bar.address)).to.equal("52")
    expect(await this.sushi.balanceOf(this.alice.address)).to.equal("70")
    expect(await this.sushi.balanceOf(this.bob.address)).to.equal("98")
  })


  it("should not allow leave if time is before 2 days", async function () {
    await this.sushi.approve(this.bar.address, "100")
    await this.bar.enter("100")
    await expect(this.bar.leave("100", "0")).to.be.revertedWith("Lock period is still active, please use forceLeave")
    await expect(this.bar.forceLeave("100", "0")).to.be.revertedWith("Locked period is still active, please try after some time")
  })

  it("should not allow leave if time is before 2-4 days and cut 75% tax if use forceLeave", async function () {
    await this.sushi.approve(this.bar.address, "100")
    await this.bar.enter("100")
    const SECONDS_IN_ONE_DAY = 86400

    // Increase the time period of neext block
    await hre.network.provider.send("evm_increaseTime", [3*SECONDS_IN_ONE_DAY])
    await hre.network.provider.send("evm_mine")

    await expect(this.bar.leave("100", "0")).to.be.revertedWith("Lock period is still active, please use forceLeave")
    await this.bar.forceLeave("100", "0")

    console.log(this.bar.balanceOf(this.alice.address))

    expect(await this.bar.balanceOf(this.alice.address)).to.equal("25")
  })

  it("should not allow leave if time is before 4-6 days and cut 50% tax if use forceLeave", async function () {
    await this.sushi.approve(this.bar.address, "100")
    await this.bar.enter("100")
    const SECONDS_IN_ONE_DAY = 86400

    // Increase the time period of neext block
    await hre.network.provider.send("evm_increaseTime", [5*SECONDS_IN_ONE_DAY])
    await hre.network.provider.send("evm_mine")

    await expect(this.bar.leave("100", "0")).to.be.revertedWith("Lock period is still active, please use forceLeave")
    await this.bar.forceLeave("100", "0")

    console.log(this.bar.balanceOf(this.alice.address))

    expect(await this.bar.balanceOf(this.alice.address)).to.equal("50")
  })

  it("should not allow leave if time is before 6-8 days and cut 25% tax if use forceLeave", async function () {
    await this.sushi.approve(this.bar.address, "100")
    await this.bar.enter("100")
    const SECONDS_IN_ONE_DAY = 86400

    // Increase the time period of neext block
    await hre.network.provider.send("evm_increaseTime", [5*SECONDS_IN_ONE_DAY])
    await hre.network.provider.send("evm_mine")

    await expect(this.bar.leave("100", "0")).to.be.revertedWith("Lock period is still active, please use forceLeave")
    await this.bar.forceLeave("100", "0")

    console.log(this.bar.balanceOf(this.alice.address))
    
    expect(await this.bar.balanceOf(this.alice.address)).to.equal("75")
  })
})
