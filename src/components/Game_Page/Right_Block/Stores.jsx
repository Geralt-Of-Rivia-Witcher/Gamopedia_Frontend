import React from "react";

function Stores(array)
{

    function createLinks(domain)
    {
        return "https://" + domain;
    }

    if(array.length === 0)
    {
        return(
            <p className="info">Not Available</p>
        );
    }

    return (
        <>
            {array.map((store) => 
            {
                return(
                    <div key={ store.id }>
                        <a href={ createLinks(store.store.domain) } target="_blank" rel="noreferrer" className="info" >
                            { store.store.name }
                        </a>
                        <br />
                        <br />
                    </div>
                );
            })}
        </>
    );
}

export default Stores;