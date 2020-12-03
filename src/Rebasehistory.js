import { ethers } from "ethers";
import basedABI from './contracts/based.json'
import univ2BasedSusdABI from './contracts/univ2basedsusd.json'
import React, { useState, useEffect } from 'react'
import Dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import fire from '../src/config/firebase'
Dayjs.extend(utc)


const History = () => {

    const [history, setHistory] = useState([])
    const [currentblock, setCurrentblock] = useState(0)
    // const [TWAP, setTWAP] = useState(0)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const basedAddress = "0x68A118Ef45063051Eac49c7e647CE5Ace48a68a5"
    const basedContract = new ethers.Contract(basedAddress, basedABI, provider)
    //the uni contract
    const univ2BasedSusdAddress = "0xaad22f5543fcdaa694b68f94be177b561836ae57"
    const univ2BasedSusdContract = new ethers.Contract(univ2BasedSusdAddress, univ2BasedSusdABI, provider)
    //Uni sync events are logged everytime anything happens with a uni pair. We are using this for historical prices.
    var uniSyncEvents = univ2BasedSusdContract.filters.Sync(null, null)
    const db = fire.firestore()
    let blocktostart
    let dbarray
    const formatbignumber = (bignumber) => {
        var bignumberstring = bignumber.toString()
        var formatbignumber1 = ethers.utils.formatUnits(bignumberstring, 18)
        var formatbignumber2 = Number(formatbignumber1.substr(0, 12))
        return formatbignumber2
    }

    useEffect(() => {

        //this function  takes in a rebase object and returns an object with blocknumber, totalsupply, and time (strips away other shit)
        const rebaseWithTimeandPrice = async (rebase) => {
            let blocknumber = rebase.blockNumber
            const unisyncs = await univ2BasedSusdContract.queryFilter(uniSyncEvents, blocknumber, blocknumber + 100)
            let block = await rebase.getBlock()
            let res0 = formatbignumber(unisyncs[0].args.reserve0)
            let res1 = formatbignumber(unisyncs[0].args.reserve1)
            // let res0format1 = ethers.utils.formatUnits(res0, 18)
            // let res1format1 = ethers.utils.formatUnits(res1, 18)
            let blockprice = (res0 / res1)
            let totalsupply = formatbignumber(rebase.args.totalSupply)
            let rebasedate = Dayjs.unix(block.timestamp).utc().format('DD/MM/YYYY')
            return { blocknumber, totalsupply, rebasedate, blockprice }
        }

        //this function gets the current block
        const getcurrentblock = async () => {
            let block = await provider.getBlockNumber();
            return block;
        }
        // This function doesnt actually run until we've checked whether or not the database is up to date. It gets run in the database get below.
        const fetchChainData = async () => {

            //set the right contract event and params to query
            var allrebaseevents = basedContract.filters.LogRebase(null, null)

            //get the current block of the chain
            const blocknow = await getcurrentblock()
            setCurrentblock(blocknow)
            // const firstbasedblock = 10685466
            // query the chain for the events for the specified blocks
            const rebases = await basedContract.queryFilter(allrebaseevents, blocktostart, blocknow)

            // sends all rebases to be returned with time - sends all at once, finishes when all are returned.

            Promise.all(rebases.map((rebase) => {
                return rebaseWithTimeandPrice(rebase)
            })).then(newrebasehistory => {
                console.log(newrebasehistory)
                if (newrebasehistory.length > 0) {
                    var batch = db.batch()
                    newrebasehistory.forEach((rebase) => {
                        batch.set(db.collection('Rebases').doc(String(rebase.blocknumber)), rebase)
                    })
                    batch.commit().then(() => {
                        console.log(dbarray);
                        let allrebasehistory = dbarray.concat(newrebasehistory)
                        // console.log(allrebasehistory);
                        setHistory(allrebasehistory)
                    })
                        .catch(error => {
                            console.log('Error - ' + error.message)
                        })
                }
            })

        }

        //this checks the database for rebases, if there's data it uses it and only fetches from the latest block onwards
        //if no data then it fetches as much as possible from first based block which is 10685466

        db.collection("Rebases").get()
            .then((snapshot) => {
                dbarray = snapshot.docs.map((rebasedoc) => rebasedoc.data())
                if (dbarray.length > 0) {
                    setHistory(dbarray)
                    blocktostart = dbarray[dbarray.length - 1].blocknumber + 1
                    fetchChainData()
                } else {
                    blocktostart = 10685466
                    console.log("No rebases found");
                    fetchChainData()
                }
            }).catch(function (error) {
                blocktostart = 10685466
                console.log("Error getting rebases", error)
                fetchChainData()
            })

    }, [])

    return (
        <div>
            we are on block {currentblock}
            <table>
                <tbody>
                    {history.map((rebase, i, history) => {
                        return <tr key={i + 1}>
                            <td><strong>Supply:</strong> {parseInt(rebase.totalsupply)}</td>
                            <td><strong> Datetime:</strong> {rebase.rebasedate}</td>
                            <td><strong> Supplydelta:</strong> {((i > 0) ? parseInt(history[i].totalsupply - history[i - 1].totalsupply) : '4899803')}</td>
                            <td><strong> Marketcap:</strong> {parseInt(rebase.blockprice * rebase.totalsupply)}</td>
                            <td><strong> Blocknumber:</strong> {rebase.blocknumber}</td></tr>

                    })}
                </tbody>
            </table>
            <h2>{(!history.length > 0) && 'REBASE HISTORY IS LOADING...  '}</h2>
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