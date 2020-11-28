import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {
    BrowserRouter as Router,
} from "react-router-dom"

// document.body.style.margin = '0';

ReactDOM.render(
    <Router>
        <App />
    </Router>
    , document.getElementById('root'))