import { ethers } from "ethers";
import snowswaproverABI from './contracts/snowswaprover.json'
import React, { useState } from 'react'
import SingleRover from './SingleRover'
import roverlist from './roverlist.json'

const Rovers = () => {
    console.log(roverlist);
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