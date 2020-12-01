import { ethers } from "ethers";
import univ2BasedSusdABI from '../src/contracts/univ2basedsusd.json'
import fire from '../src/config/firebase'
module.exports = (req, res) => {
    const network = "homestead";
    const provider = ethers.getDefaultProvider(network, {
        etherscan: 'CT8EK3BA88F23TXUR7ER3PMPB1PZJ2HK6W',
        // infura: {
        //     projectId: 'ea6f516573a2493899a9c64fb09d061f',
        //     projectSecret: 'baf86b3ae9ab4326bbc5a1d69e4d1298'
        // },
        alchemy: 'O_RM7BqwV6-k_j9qNHuuJCmehIWcLmXZ'
    })
    const univ2BasedSusdAddress = "0xaad22f5543fcdaa694b68f94be177b561836ae57"
    const univ2BasedSusdContract = new ethers.Contract(univ2BasedSusdAddress, univ2BasedSusdABI, provider)

    const resultarray = provider.getBlockNumber().then((result) => {
        let promisearray = [univ2BasedSusdContract.price1CumulativeLast(), provider.getBlock(result)]
        Promise.all(promisearray).then((result) => {
            let blocknumber = result[1].number
            let timestamp = result[1].timestamp
            console.log(result);

            fire.firestore()
                .collection('Oracle')
                .doc('TwapPoint')
                .set({
                    pricetimepostrebasetime: result[0].toString(),
                    timestamp: timestamp,
                    blocknumber: blocknumber
                });
            return {
                pricetimepostrebasetime: result[0].toString(),
                timestamp: timestamp,
                blocknumber: blocknumber
            }
        })
    }
    )
    resultarray.then(result => res.status(200).send(result.pricetimepostrebasetime)
    )
}