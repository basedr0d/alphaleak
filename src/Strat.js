import React from 'react'
import { ethers } from "ethers";
import univ2BasedSusdABI from '../src/contracts/univ2basedsusd.json'
import ReactPlayer from 'react-player'
import vidsrc from './ampledork.mp4'
// import fire from '../src/config/firebase'

const Strat = () => {

    // let things = [{ stuff: 'a' }, { stuff: 'b' }, { stuff: 'c' }, { stuff: 'd' }]

    // var db = fire.firestore()

    // // db.collection("Rebases").get().then((querySnapshot) => {
    // //     // console.log(querySnapshot.id);
    // //     let dbarray = querySnapshot.docs.map((rebasedoc) => rebasedoc.data())
    // //     console.log(dbarray);
    // // })

    // db.collection("Oracle").get()
    //     .then((rebasesfromdb) => {
    //         if (rebasesfromdb.exists) {
    //             console.log(rebasesfromdb)
    //             // setHistory(rebasesfromdb)
    //         } else {
    //             // blocktostart = 10685466
    //             console.log("No rebases found");
    //         }
    //     }).catch(function (error) {
    //         // blocktostart = 10685466
    //         console.log("Error getting rebases", error)
    //     })
    // var batch = db.batch()
    // things.forEach((thing, i) => {
    //     // console.log(String(i))
    //     batch.set(db.collection('rebases').doc(String(i)), thing)
    // })
    // batch.commit().then(() => {
    //     console.log('process finished');
    // })



    return (
        <div>
            <ReactPlayer
                url={vidsrc}
                config={{
                    muted: true,
                    volume: 1,
                    file: {
                        forceVideo: true,
                        attributes: { controls: true, autoplay: true, muted: true, preload: 'auto', },
                        playing: true
                    }
                }}
            />
        </div>
    )
}
export default Strat