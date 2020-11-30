import React from 'react'
import {
    Link,
    useLocation
} from "react-router-dom"
import abovefoldimg from './based-city.gif'


export const Navbar = ({ nav }) => {
    const location = useLocation()

    if (location.pathname === "/moonbasecity") { return (<></>) }
    else {
        return (
            <div>
                {nav.map((value) => {
                    return <span key={value.id}><Link key={value.id} to={value.link}>{value.text}</Link>  |  </span>
                })}
                <p />
                <img alt='fuckoffwithyouralttextrules' src={abovefoldimg} width="450px" />
            </div>
        )
    }
}

export const Header = ({ title, heading }) => {
    return (
        <>
            <title>{title}</title>
            <h1>{heading}</h1>
        </>
    )
}

export const Footer = ({ shill, footerimg, footertext }) => {
    const location = useLocation()
    if (location.pathname === "/moonbasecity") { return (<></>) }
    else {
        return (
            <>
                <p />
                {footertext}
                <p /><a href={shill.link}>{shill.text}</a>
                <p /> <strong>if u like this u can donate here:
                <p />0x984921f4019A8E9988A9262d20e22b80C032fEa0</strong>
                <p /> <img src={footerimg} width="500" alt='' />

            </>
        )
    }
}

export const Button = ({ onClick, text }) => (
    <button onClick={onClick}>
        {text}
    </button>
)