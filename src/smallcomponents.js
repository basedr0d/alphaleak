import React from 'react'
import {
    Link,
    useLocation
} from "react-router-dom"


export const Navbar = ({ nav }) => {
    const location = useLocation()

    if (location.pathname === "/moonbasecity") { return (<></>) }
    else {
        return (
            <div>
                {nav.map((value) => {
                    return <span key={value.id}><Link key={value.id} to={value.link}>{value.text}</Link>  |  </span>
                })}
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