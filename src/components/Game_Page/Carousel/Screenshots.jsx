import React, { useState } from "react";
import axios from "axios";
import Carousel from 'react-material-ui-carousel'
import { Paper } from '@material-ui/core'
import env from "react-dotenv";

var previousGameName = "";
let BACKEND_URL = env.BACKEND_URL || "http://localhost:5000/";

function getScreenshots(gameName)
{
    return new Promise((resolve, reject) =>
    {
        axios.post(BACKEND_URL + "api/screenshots", { gameName: gameName })
        .then((res) =>
        {
            if(res.data.count === 0)
            {
                resolve([]);
            }
            resolve(res.data.results);
        })
        .catch((error) =>
        {
            console.log(error);
        });
    });
    
}

function Screenshots(props)
{
    const [List, setList] = useState(<p className="info">Getting Screenshots</p>);

    function sendScreenshotsList(screenshotsList)
    {
        function Item(props)
        {
            return (
                <Paper elevation={ 2 } style={{ backgroundColor: "transparent" }}>
                    <img src={ props.item.image } alt="Game-screenshot" className="screenshot" />
                </Paper>
            )
        }

        if(typeof screenshotsList !== "undefined" && screenshotsList.length > 0)
        {
            return(
                <>
                    {
                        <Carousel
                            animation="fade" 
                            navButtonsAlwaysVisible="true" 
                            changeOnFirstRender="true" 
                            autoPlay="true"
                        >
                            {
                                screenshotsList.map( (item, i) => <Item key={ item.id } item={ item } /> )
                            }
                        </Carousel>
                    }
                </>
            );
        }
        else
        {
            return (<p className="info">Not Available</p>);
        }
    }

    if(previousGameName !== props.gameName)
    {
        previousGameName = props.gameName;
        getScreenshots(props.gameName)
        .then((screenshotssList) =>
        {
            setList(() =>
            {
                return(<>{ sendScreenshotsList(screenshotssList) }</>);
            });
        })
        .catch((error) =>
        {
            console.log(error);
        });
    }
    return(<>{ List }</>);
}

export default Screenshots;