import React, { useState, useEffect } from 'react'
// import { ethers } from "ethers";
// import univ2BasedSusdABI from '../src/contracts/univ2basedsusd.json'
// import vidsrc from './ampledork.mp4'
// import vidsrc2 from './moonbased.mp4'
import classes from './BackgroundVideo.module.css'
import ReactPlayer from 'react-player'
import muteicon from './muteicon.png'
import unmuteicon from './unmuteicon.png'
import fire from '../src/config/firebase'
import vids from './vids.json'


var storage = fire.storage();
// var storageRef = storage.ref();

let sources = shuffle(vids)

// const displayVid = (vidRef) => {
//   vidRef.getDownloadURL().then((url) => {
// // console.log(url)
// // console.log(typeof url);
// sources.concat(url)})
// .catch((error) => {
//   console.log(error)
// });
// }


// Promise.all(rebases.map((rebase) => {
//   return rebaseWithTimeandPrice(rebase)
// })).then(newrebasehistory => {
//   console.log(newrebasehistory)
//   if (newrebasehistory.length > 0) {
//       var batch = db.batch()
//       newrebasehistory.forEach((rebase) => {
//           batch.set(db.collection('Rebases').doc(String(rebase.blocknumber)), rebase)
//       })
//       batch.commit().then(() => {
//           console.log(dbarray);
//           let allrebasehistory = dbarray.concat(newrebasehistory)
//           // console.log(allrebasehistory);
//           setHistory(allrebasehistory)
//       })
//           .catch(error => {
//               console.log('Error - ' + error.message)
//           })
//   }
// })

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// storageRef.listAll().then((result) => {
// console.log(result.items)

//   Promise.all(result.items.map((vidRef) => {
//     return vidRef.getDownloadURL()
//   })).then(vidURLs => {
//    sources = shuffle(vidURLs) 
//   })

// })  


// result.items.forEach(async (vidRef)=> {
// sources.concat(await vidRef.getDownloadURL())
//   })
// })
// .catch((error)=> {
// console.log(error)
// })

const BasedTV = () => {
    const [currentVid, setCurrentVid] = useState(sources[0])
    const [muteState, setMuteState] = useState(true)
    const [icon,setIcon] = useState(muteicon)
    // const [sources, setSources] = useState([])

    const muteHandler = () => {
        setMuteState(!muteState)
        if (muteState) setIcon(unmuteicon) 
        else setIcon(muteicon) 
    }

    const handleEnded = () => {
        var index = sources.indexOf(currentVid) //starts at 0
        if (index === sources.length -1) index = 0
        else index ++
        console.log(index)
        setCurrentVid(sources[index])
        console.log('onEnded')
      }
      
    return (
            <div className={classes.Container} >
            <ReactPlayer
            width='100vw'
            height='100vh'
            onEnded={handleEnded}
            controls={false}
            muted={muteState}    
            loop={false}
            playing	
            autoPlay
  url={currentVid}

/>
<div className={classes.Mutebutton}>
<img src={icon} onClick={muteHandler} width='100%'/>
</div>  
    </div>
    )
}
export default BasedTV