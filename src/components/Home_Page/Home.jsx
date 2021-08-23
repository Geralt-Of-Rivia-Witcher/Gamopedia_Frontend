import React from "react";

import { SearchBar } from "../Search_Bar/SearchBar.jsx";
import Footer from "../Footer/Footer.jsx";

import "./styles.css";

function Home()
{

    return(
        <>
            <div className="title-div">
                <h1 className="title">Gamopedia</h1>
            </div>
            <div className="search-bar-home">
                <SearchBar />
            </div>
            <div className="home-page-footer-div">
                <Footer />
            </div>
        </>
    );
}

export default Home;