import { ethers } from "ethers";
import React, { useState } from 'react'
import roverABI from './contracts/roverabi.json'

const SingleRover = ({ roverAddress, roverProject, roverToken }) => {
    console.log(roverAddress);
    const [roverBal, setRoverBal] = useState('...')
    const [rugReward, setRugReward] = useState('...')

    let provider;
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
    const signer = provider.getSigner();

    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // const signer = provider.getSigner()
    // const getbalance = provider.getBalance("ethers.eth")
    //   getbalance.then(response => {
    // const formatbalance = ethers.utils.formatEther(response)
    //     setBalance(formatbalance.toString())
    //   })
    // const testroverAddress = "0xE88e6E5E182B2bbdC3fb10E4b1c8bA83c25FBdd3"
    const RoverAbi = roverABI
    const roverContract = new ethers.Contract(roverAddress, RoverAbi, provider)
    const getRoverBalance = roverContract.latestBalance()
    getRoverBalance.then(response => {
        const formattedroverbalance = ethers.utils.formatEther(response)
        setRoverBal(formattedroverbalance.toString());
    })
    const getRugReward = roverContract.calculateReward()
    getRugReward.then(response => {
        const formattedroverreward = ethers.utils.formatEther(response)
        setRugReward(formattedroverreward.toString());
    })

    const roverWithSigner = roverContract.connect(signer);
    const rugpull = () => roverWithSigner.rugPull()

    return (
        <div>
            <h2>{roverProject} Rover</h2>
            <p />
            There is currently {roverBal} {roverToken} in the Rover
            <p />
            Accumulated reward is {rugReward} {roverToken}
            <p />
            <button onClick={rugpull}> Rugpull </button>
        </div>
    )
}
export default SingleRover