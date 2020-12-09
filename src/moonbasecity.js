import React from 'react'
import videoSource from './moonbased.mp4'
import classes from './BackgroundVideo.module.css'


const Moonbasecity = () => {

    // const vidstyle = {
    //     bottom: 0,
    //     minHeight: '100%',
    //     display: 'block',
    //     margin: '0 auto'
    // }
    return (
        <>
            <div className={classes.Container} >
                <video autoPlay="autoplay" loop="loop" muted className={classes.Video}>
                    <source src={videoSource} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            </div>
        </>
    )
}

export default Moonbasecity;