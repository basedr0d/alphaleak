import { ethers } from "ethers";
import snowswaproverABI from './contracts/snowswaprover.json'
import React, { useState } from 'react'
import SingleRover from './SingleRover'
import roverlist from './roverlist.json'

const Rovers = () => {
    console.log(roverlist);
    // const [snowBal, setsnowBal] = useState('...')
    // const [snowReward, setsnowReward] = useState('...')
    // const [warBal, setWarBal] = useState('...')
    // const [warReward, setWarReward] = useState('...')

    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // const signer = provider.getSigner()
    // const getbalance = provider.getBalance("ethers.eth")
    //   getbalance.then(response => {
    // const formatbalance = ethers.utils.formatEther(response)
    //     setBalance(formatbalance.toString())
    //   })
    // const snowRoverAddress = "0xE88e6E5E182B2bbdC3fb10E4b1c8bA83c25FBdd3"
    // const snowRoverAbi = snowswaproverABI
    // const snowRoverContract = new ethers.Contract(snowRoverAddress, snowRoverAbi, provider)
    // const getSnowRoverBalance = snowRoverContract.latestBalance()
    // getSnowRoverBalance.then(response => {
    //     const formattedroverbalance = ethers.utils.formatEther(response)
    //     setsnowBal(formattedroverbalance.toString());
    // })
    // const getroverReward = snowRoverContract.calculateReward()
    // getroverReward.then(response => {
    //     const formattedroverreward = ethers.utils.formatEther(response)
    //     setsnowReward(formattedroverreward.toString());
    // })

    // const roverWithSigner = snowRoverContract.connect(signer);
    // const rugpull = () => roverWithSigner.rugPull()

    // const warRoverAddress = "0x9D79e728cFf8DEA7f75e3367BDEb15F462Fa3D60"
    // const warRoverContract = new ethers.Contract(warRoverAddress, snowRoverAbi, provider)
    // const getWarRoverBalance = warRoverContract.latestBalance()
    // getWarRoverBalance.then(response => {
    //     const formattedroverbalance = ethers.utils.formatEther(response)
    //     setWarBal(formattedroverbalance.toString());
    // })

    return (
        <div>
            {roverlist.map((rover) => {
                {/* console.log(rover.contractaddress) */ }
                return <SingleRover key={rover.contractaddress} roverAddress={rover.contractaddress}
                    roverProject={rover.project} roverToken={rover.token} />
            })}
        </div>
    )
}
export default Rovers