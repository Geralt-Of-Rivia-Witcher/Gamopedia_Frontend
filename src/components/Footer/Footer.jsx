import React from "react";

import "./styles.css"

function Footer()
{
    return(
        <div className="footer-div">
            <p className="footer-text">By: <a className ="footer-links" href="https://siddhantkumarsingh.me" target="_blank" rel="noreferrer" >Siddhant Kumar Singh</a></p>
            <p className="footer-text">Data By: <a className ="footer-links" href="https://rawg.io/apidocs" target="_blank" rel="noreferrer">RAWG Video Game Database</a></p>
        </div>
    );
}

export default Footer;