import React from "react";
import Grid from "@material-ui/core/Grid";
import { Markup } from "interweave";
import  { Redirect } from "react-router-dom";

import LeftBlock from "./Left_Block/Block.jsx";
import { gameData } from "../Search_Bar/SearchBar.jsx";
import ProgressBar from "./Middle_Block/ProgressBar.jsx";
import PlatformRatings from "./Middle_Block/PlatformRatings.jsx";
import Platforms from "./Left_Block/Platforms.jsx";
import Stores from "./Right_Block/Stores.jsx";
import Editions from "./Right_Block/Editions.jsx";
import { SearchBar } from "../Search_Bar/SearchBar.jsx";
import Screenshots from "./Carousel/Screenshots.jsx";
import Footer from "../Footer/Footer.jsx";

import "./styles.css";

function Game()
{
    if(typeof gameData === "undefined")
    {
        return (< Redirect to="/" />);
    }

    return(
        <>
            <div className="search-bar">
                <SearchBar class="hideButton" />
            </div>
            <img className="game-image" src={ gameData.background_image } alt="Game_Img" />
            <h1 className="game-name">{ gameData.name }</h1>
            <Markup className="game-description" content={gameData.description} />

            <Grid container spacing={0} className="grid-container" >

                <Grid className="grid left-grid" item sm={4} xs={12} >
                    <LeftBlock heading="Developer" info={ gameData.developers } />
                    <LeftBlock heading="Publisher" info={ gameData.publishers } />
                    { gameData.tba ? <><h3 className="heading">Release Data</h3><p className="info">To Be Announced</p></> : <LeftBlock heading="Release Date" info={ gameData.released } /> }
                    <LeftBlock heading="Last Updated" info={ gameData.updated } />
                    <LeftBlock heading="Genre" info={ gameData.genres } />
                    <h3 className="heading">ESRB Rating</h3><p className="info">{ gameData.esrb_rating === null ? "Not Available" : gameData.esrb_rating.name }</p>
                    <Platforms heading="Platforms" info={ gameData.platforms } />
                </Grid>

                <Grid className="grid" item sm={4} xs={12} >
                    <h3 className="heading">Metacritic Rating</h3>
                    { gameData.metacritic !== null ? <ProgressBar score={ gameData.metacritic }platform="Overall" /> : <p className="info">Not Available</p> }
                    { PlatformRatings(gameData.metacritic_platforms) }
                </Grid>

                <Grid className="grid right-grid" item sm={4} xs={12} >
                    <h3 className="heading">Useful Links</h3>
                    { gameData.website === "" && gameData.reddit_url === "" ? <p className="info">Not Available</p> :
                    <>
                        <a href={ gameData.website } target="_blank" rel="noreferrer" className="info">Official Website</a>
                        <br />
                        <br />
                        <a href={ gameData.reddit_url } target="_blank" rel="noreferrer" className="info">Reddit</a>
                        <br />
                        <br />
                    </>}
                    <h3 className="heading">Stores</h3>
                    { Stores(gameData.stores) }
                    <h3 className="heading">DLCs & Editions</h3>
                    <Editions gameName={ gameData.slug } />
                </Grid>
            </Grid>
            
            <h3 className="heading screenshot-heading">Screenshots</h3>
            <div className="screenshots-div">
                <Screenshots gameName={ gameData.slug } />
            </div>
            <Footer />
        </>
    );
}

export default Game;