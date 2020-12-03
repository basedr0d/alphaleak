import { ethers, BigNumber } from "ethers";
import univ2BasedSusdABI from './contracts/univ2basedsusd.json'
import React, { useState, useEffect } from 'react'
import Dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import fire from '../src/config/firebase'
Dayjs.extend(utc)

// function decode(price) {
//     return price.multipliedBy(1e18).dividedBy(new BN(2).pow(112))
//   }

// function calculateTWAP(priceCumulativeOld, priceCumulativeNew, timestampOld, timestampNew) {
//     let bigpricetimeold = BigNumber.from(priceCumulativeOld)
//     let bigpricetimenew = BigNumber.from(priceCumulativeNew)
//     let bigtimeold = BigNumber.from(timestampOld)
//     let bigtimenew = BigNumber.from(timestampNew)

//     const timeElapsed = bigtimenew.sub(bigtimeold)
//     return decode(bigpricetimenew.sub(bigpricetimeold).div(timeElapsed));
// }

const Faketwap = () => {

    const [TWAP, setTWAP] = useState('loading...')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    //the uni contract
    const univ2BasedSusdAddress = "0xaad22f5543fcdaa694b68f94be177b561836ae57"
    const univ2BasedSusdContract = new ethers.Contract(univ2BasedSusdAddress, univ2BasedSusdABI, provider)
    const db = fire.firestore()
    const decode = (price) => {
        let decodeconst = BigNumber.from(2).pow(112)
        let bigexpo = BigNumber.from(10).pow(18)
        let pricedivby = price.mul(bigexpo).div(decodeconst)
        return pricedivby
    }

    const formatbignumber = (bignumber) => {
        var bignumberstring = bignumber.toString()
        var formatbignumber1 = ethers.utils.formatUnits(bignumberstring, 18)
        var formatbignumber2 = Number(formatbignumber1.substr(0, 12))
        return formatbignumber2
    }

    // const getcurrentblock = async () => {
    //     let blocknumber = await provider.getBlockNumber();
    //     return blocknumber;
    // }

    const getblocktime = async (blocknumber) => {
        let block = await provider.getBlock(blocknumber)
        return block.timestamp
    }

    const formatunixtime = (timestamp) => {
        return Dayjs.unix(timestamp).utc().format('HH:mm DD/MM/YY')
    }

    useEffect(() => {
        var uniSyncEvents = univ2BasedSusdContract.filters.Sync(null, null)
        //this function gets the current block

        const fetchChainData = async () => {

            // const blocknow = await getcurrentblock()
            // const blocknow = 11342595
            // const latestblocktime = await getblocktime(blocknow)
            // console.log(formatunixtime(latestblocktime))

            const docRef = db.collection('Oracle').doc('TwapPoint')
            const unisyncs = (blocknumber) => univ2BasedSusdContract.queryFilter(uniSyncEvents, blocknumber - 1000, blocknumber)

            async function getlatestsync(block, defaulttime) {
                let syncs = await unisyncs(block)
                if (syncs.length === 0) {
                    console.log('no blocks');
                    return defaulttime
                }
                else {
                    let newest = syncs.length - 1
                    console.log(syncs[newest].blockNumber);
                    console.log(syncs[newest].args.reserve0 / syncs[newest].args.reserve1)
                    let lastsyncblock = syncs[newest].blockNumber
                    return await getblocktime(lastsyncblock)
                }
            }

            provider.getBlockNumber().then(result => {

                let promisearray = [docRef.get(), provider.getBlock(result), univ2BasedSusdContract.price1CumulativeLast()]
                Promise.all(promisearray).then(result => {

                    //need to find timestamps of the blocks from the most recent sync events
                    let oldblock = result[0].data().blocknumber
                    let newblock = result[1].number
                    let syncblocksarray = [getlatestsync(oldblock, result[0].data().timestamp), getlatestsync(newblock, result[1].timestamp)]

                    Promise.all(syncblocksarray).then(syncblocks => {
                        let oldblocktime = syncblocks[0]
                        let newblocktime = syncblocks[1]

                        if (newblocktime !== oldblocktime) {
                            console.log('the most recent sync event was '.concat(formatunixtime(newblocktime)))
                            console.log('the closest sync event before the last rebase was '.concat(formatunixtime(oldblocktime)))

                            let bigNumPricetime2 = result[2]
                            // console.log(bigNumPricetime2.toString());
                            let bigNumPricetime1 = BigNumber.from(result[0].data().pricetimepostrebasetime)
                            // console.log(bigNumPricetime1.toString());
                            // let pricetime2 = BigNumber.from('2067695973578670000000000000000000000000000')
                            // let pricetime1 = BigNumber.from('2067664046374310000000000000000000000000000')

                            let bigNumTime2 = BigNumber.from(newblocktime)
                            let bigNumTime1 = BigNumber.from(oldblocktime)

                            // let time2 = BigNumber.from('1606886655')
                            // let time1 = BigNumber.from('1606876982')

                            let pricetimediff = bigNumPricetime2.sub(bigNumPricetime1)
                            // console.log(pricetimediff.toString());
                            let timeElapsed = bigNumTime2.sub(bigNumTime1)
                            console.log(timeElapsed.toString());

                            let codedTwap = pricetimediff.div(timeElapsed)
                            // let decodeconst = BigNumber.from(2).pow(112)
                            // let bigexpo = BigNumber.from('1000000000000000000')
                            let decodedTwap = decode(codedTwap)
                            console.log(formatbignumber(decodedTwap.toString()))
                            setTWAP(formatbignumber(decodedTwap.toString()))

                        }
                        else if (newblocktime === oldblocktime) {
                            setTWAP('oops bug fk')
                        }
                    })

                    // let oldblocktime
                    // unisyncs(oldblock).then(lastsync => {
                    //     if (lastsync.length === 0) { oldblocktime = result[2].data().timestamp }
                    //     else {
                    //         let newest = lastsync.length - 1
                    //         let lastsyncblock = lastsync[newest].blockNumber
                    //         getblocktime(lastsyncblock).then(result => {
                    //             oldblocktime = result
                    //             console.log(oldblocktime);
                    //             // console.log('last sync before 8pmutc was '.concat(oldblocktime));
                    //         })
                    //     }
                    // })

                    // let newblocktime
                    // unisyncs(newblock).then(lastsync => {
                    //     if (lastsync.length === 0) { newblocktime = BigNumber.from(result[1].timestamp) }
                    //     else {
                    //         let newest = lastsync.length - 1
                    //         let lastsyncblock = lastsync[newest].blockNumber
                    //         getblocktime(lastsyncblock).then(result => {
                    //             newblocktime = result
                    //             console.log(newblocktime);
                    //             // console.log('last sync before 8pmutc was '.concat(oldblocktime));
                    //         })
                    //     }
                    // })

                })
            })
        }

        fetchChainData()
    }, [])

    const twapstyles = {
        fontSize: 18,
        padding: 10,
        position: 'absolute',
        right: 0,
        fontWeight: 'bold'
    }
    return (
        <div style={twapstyles} >
            Rough TWAP Since Last Rebase: {TWAP}
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