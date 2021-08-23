import React from "react";
import ProgressBar from "./ProgressBar";

function PlatformRatings(array)
{
    return (
    <>
        {array.map((rating) => 
        {
            return(
                <a key={ rating.platform.platform } href={ rating.url } target="_blank" rel="noreferrer" >
                    <ProgressBar score={ rating.metascore } platform={ rating.platform.name } />
                </a>
            );
        })}
    </>);
}

export default PlatformRatings;