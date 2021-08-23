import React from "react";
import toString from "./toString";

function Block(props)
{

    return(
        <>
            <h3 className="heading">{ props.heading }</h3>
            <p className="info">{ toString(props.info) }</p>
        </>
    );
}

export default Block;