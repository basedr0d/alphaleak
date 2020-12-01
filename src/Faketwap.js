import { ethers } from "ethers";
import univ2BasedSusdABI from './contracts/univ2basedsusd.json'
import React, { useState, useEffect } from 'react'
import Dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
Dayjs.extend(utc)

const Faketwap = () => {

    // const [currentblock, setCurrentblock] = useState(0)
    const [TWAP, setTWAP] = useState('...')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    //the uni contract
    const univ2BasedSusdAddress = "0xaad22f5543fcdaa694b68f94be177b561836ae57"
    const univ2BasedSusdContract = new ethers.Contract(univ2BasedSusdAddress, univ2BasedSusdABI, provider)
    //Uni sync events are logged everytime anything happens with a uni pair. We are using this for historical prices.
    var uniSyncEvents = univ2BasedSusdContract.filters.Sync(null, null)
    // const test = univ2BasedSusdContract.price1CumulativeLast()
    // const getprice1 = univ2BasedSusdContract.price1CumulativeLast()
    // const blocksperday = 5760
    // async function getUniEvents() {
    //     // const unisyncs = await univ2BasedSusdContract.queryFilter(uniSyncEvents, 11358694, 11358894)
    //     console.log(unisyncs);
    //     let res0 = unisyncs[0].args.reserve0.toString()
    //     let res1 = unisyncs[0].args.reserve1.toString()
    //     let dividedprice = unisyncs[0].args.reserve0.div(unisyncs[0].args.reserve1)
    //     // const uniblock = await unisyncs[0].getBlock()
    //     // const unitime = uniblock.timestamp
    //     let res0format1 = ethers.utils.formatUnits(res0, 18)
    //     let res1format1 = ethers.utils.formatUnits(res1, 18)

    //     console.log(res0format1 / res1format1);

    // }
    // getUniEvents()

    // token 0 is susd
    //token 1 is based
    // i want price1cumulativelast becaus that's the price of token 1  denominated in token 0 --> price of based denominated in susd
    // getprice1.then(response => {
    //     console.log(response.toString());
    // })

    const formatbignumber = (bignumber) => {
        var bignumberstring = bignumber.toString()
        var formatbignumber1 = ethers.utils.formatUnits(bignumberstring, 18)
        var formatbignumber2 = Number(formatbignumber1.substr(0, 12))
        return formatbignumber2
    }

    useEffect(() => {

        //this function gets the current block
        const getcurrentblock = async () => {
            let blocknumber = await provider.getBlockNumber();
            return blocknumber;
        }
        const getblocktime = async (blocknumber) => {
            let block = await provider.getBlock(blocknumber)
            return block.timestamp
        }

        const formatunixtime = (timestamp) => {
            return Dayjs.unix(timestamp).utc().format('HH:mm DD/MM/YY')
        }
        const fetchChainData = async () => {

            //set the right contract event and params to query
            // var allrebaseevents = basedContract.filters.LogRebase(null, null)

            //get the current block of the chain
            const blocksperday = 6500
            const onedayinseconds = 24 * 60 * 60

            // const blocknow = await getcurrentblock()
            const blocknow = 11342595
            const latestblocktime = await getblocktime(blocknow)
            console.log(formatunixtime(latestblocktime));

            let roughguess = blocknow - blocksperday
            const roughguessblocktime = await getblocktime(roughguess)
            let gap = latestblocktime - roughguessblocktime - onedayinseconds
            let averagesecsperblock = (latestblocktime - roughguessblocktime) / blocksperday
            let bestguess = roughguess
            let secondguess
            if (gap > 60) {
                secondguess = Math.round(blocknow - blocksperday + (gap / averagesecsperblock))
                // console.log(secondguess);
                let secondguessblocktime = await getblocktime(secondguess)
                console.log(formatunixtime(secondguessblocktime))
                bestguess = secondguess
                gap = latestblocktime - secondguessblocktime - onedayinseconds
                console.log(gap);
            }
            else if (gap < -60) {
                secondguess = Math.round(blocknow - blocksperday - (gap / averagesecsperblock))
                // console.log(secondguess);
                let secondguessblocktime = await getblocktime(secondguess)
                console.log(formatunixtime(secondguessblocktime))
                bestguess = secondguess
                gap = latestblocktime - secondguessblocktime - onedayinseconds
                // console.log(gap);
            }
            // console.log('best guess is' & bestguess);
            //this function  takes in a rebase object and returns an object with blocknumber, totalsupply, and time (strips away other shit)
            const calculateTWAP = async (startblock, endblock) => {
                const unisyncs = await univ2BasedSusdContract.queryFilter(uniSyncEvents, startblock, endblock)

                // console.log(unisyncs)
                // console.log(unisyncs.length);

                const pricetimearray = unisyncs.map(async (sync, i, allsyncs) => {
                    let res0 = formatbignumber(sync.args.reserve0)
                    let res1 = formatbignumber(sync.args.reserve1)
                    let price = res0 / res1
                    // console.log(allsyncs[i]);
                    let time1 = await getblocktime(sync.blockNumber)
                    let time2
                    if (i === allsyncs.length - 1) time2 = await getblocktime(blocknow)
                    else time2 = await getblocktime(allsyncs[i + 1].blockNumber)
                    let pricetimewhole = price * (time2 - time1)
                    let secondsatprice = time2 - time1
                    // return { pricetime:  pricetimewhole, time:  time2 }
                    return { pricetime: pricetimewhole, time: secondsatprice }
                })
                let pricetimesum
                let timesum
                Promise.all(pricetimearray).then((values) => {
                    console.log(values[0].time);
                    // pricetimesum = values.forEach()
                    pricetimesum = values.reduce((a, b) => ({ pricetime: a.pricetime + b.pricetime }))
                    timesum = values.reduce((a, b) => ({ time: a.time + b.time }));
                    // timesum = values.reduce((a, b) => a.time + b.time, 0)
                    console.log(pricetimesum)
                    console.log(timesum);
                    console.log(pricetimesum.pricetime / timesum.time);
                    console.log(pricetimesum.pricetime / onedayinseconds);

                });
                // arr.reduce((a, b) => ({ x: a.x + b.x }));


                // pricetimearray.then(result => { console.log(result) })

                // let len = pricetimearray.length - 1
                // console.log(pricetimearray[len].time - pricetimearray[0].time2);
                // let secs = pricetimearray[len].time - pricetimearray[0].time2
                // console.log(unisyncs);
                // let res0 = formatbignumber(unisyncs[0].args.reserve0)
                // // console.log(res0);
                // let res1 = formatbignumber(unisyncs[0].args.reserve1)
                // let res0format1 = ethers.utils.formatUnits(res0, 18)
                // let res1format1 = ethers.utils.formatUnits(res1, 18)
                // let blockprice = (res0 / res1)
                // let totalsupply = formatbignumber(rebase.args.totalSupply)
            }
            calculateTWAP(bestguess, blocknow)


            // const firstbasedblock = 10685466
            // query the chain for the events for the specified blocks
            // const rebases = await basedContract.queryFilter(allrebaseevents, firstbasedblock, blocknow)

            // sends all rebases to be returned with time - sends all at once, finishes when all are returned.
        }

        //call the async function that sets rebasehistory
        fetchChainData()
    }, [])

    return (
        <div>
            {TWAP}
        </div>
    )
}
export default Faketwap

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