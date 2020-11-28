import { ethers } from "ethers";
import basedABI from './contracts/based.json'
import React, { useState, useEffect } from 'react'
import Dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
Dayjs.extend(utc)

const History = () => {

    const [history, setHistory] = useState([])
    const [currentblock, setCurrentblock] = useState(0)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const basedAddress = "0x68A118Ef45063051Eac49c7e647CE5Ace48a68a5"
    const basedContract = new ethers.Contract(basedAddress, basedABI, provider)

    const supplyformat = (rebase) => {
        var supplystring = rebase.args.totalSupply.toString()
        var formatsupply1 = ethers.utils.formatUnits(supplystring, 18)
        var formatsupply2 = parseInt(formatsupply1.substr(0, 12))
        return formatsupply2
    }

    useEffect(() => {

        //this function  takes in a rebase object and returns an object with blocknumber, totalsupply, and time (strips away other shit)
        const rebasewithtime = async (rebase) => {
            let block = await rebase.getBlock()
            let totalsupply = supplyformat(rebase)
            let blocknumber = rebase.blockNumber
            let rebasedate = Dayjs.unix(block.timestamp).utc().format('DD/MM/YYYY')
            return { blocknumber, totalsupply, rebasedate }
        }

        //this function gets the current block
        const getcurrentblock = async () => {
            let block = await provider.getBlockNumber();
            return block;
        }

        const fetchChainData = async () => {

            //set the right contract event and params to query
            var allrebaseevents = basedContract.filters.LogRebase(null, null)

            //get the current block of the chain
            const blocknow = await getcurrentblock()
            setCurrentblock(blocknow)

            // query the chain for the events for the specified blocks
            const rebases = await basedContract.queryFilter(allrebaseevents, 10685466, blocknow)

            // sends all rebases to be returned with time - sends all at once, finishes when all are returned.

            const rebasehistory = Promise.all(rebases.map((rebase) => {
                return rebasewithtime(rebase)
            }))

            setHistory(await rebasehistory)

        }

        //call the async function that sets rebasehistory
        fetchChainData()
    }, [])

    return (
        <div>
            we are on block {currentblock}
            <ol>
                {history.map((rebase, i, history) => {
                    return <li key={i + 1}><strong>Supply:</strong> {rebase.totalsupply},
                    <strong> Datetime:</strong> {rebase.rebasedate},
                        <strong> Supplydelta:</strong> {((i > 0) ? history[i].totalsupply - history[i - 1].totalsupply : 0)}</li>
                })}
            </ol>
        </div>
    )
}
export default History

// {
//     "anonymous": false,
//     "inputs": [
//         {
//             "indexed": true,
//             "name": "epoch",
//             "type": "uint256"
//         },
//         {
//             "indexed": false,
//             "name": "totalSupply",
//             "type": "uint256"
//         }
//     ],
//     "name": "LogRebase",
//     "type": "event"
// }