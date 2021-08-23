import React from "react";

function Platforms(props)
{

    function toString(array)
    {
        var string = "";
        array.map((element) =>
        {
            return string += element.platform.name + ", ";
        });
        return string.substring(0, string.length - 2);
    }

    return(
        <>
            <h3 className="heading">{ props.heading }</h3>
            <p className="info">{ toString(props.info) }</p>
        </>
    );
}

export default Platforms;