import React from 'react'
import videoSource from './moonbased.mp4'
import classes from './BackgroundVideo.module.css';
import nav from './nav.json'
import {
    Link
} from "react-router-dom"

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
                <video autoPlay="autoplay" loop="loop" muted className={classes.Video} >
                    <source src={videoSource} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            </div>
            <div className={classes.Content} >
                {nav.map((value) => {
                    return <><Link key={value.id} to={value.link}>{value.text}</Link>  |  </>
                })}</div>
        </>
    )
}

export default Moonbasecity;