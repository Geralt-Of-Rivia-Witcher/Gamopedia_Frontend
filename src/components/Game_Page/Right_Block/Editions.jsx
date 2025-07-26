import React, { useState } from "react";
import axios from "axios";

var previousGameName = "";
let BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

function getEditions(gameName) {
  return new Promise((resolve, reject) => {
    axios
      .post(BACKEND_URL + "api/editions", { gameName: gameName })
      .then((res) => {
        if (res.data.count === 0) {
          resolve([]);
        }
        resolve(res.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

function Editions(props) {
  const [List, setList] = useState(<p className="info">Getting</p>);

  function sendEditionList(editionsList) {
    if (typeof editionsList !== "undefined" && editionsList.length > 0) {
      return (
        <>
          {editionsList.map((edition) => {
            return (
              <p key={edition.id} className="info">
                {edition.name}
              </p>
            );
          })}
        </>
      );
    } else {
      return <p className="info">Not Available</p>;
    }
  }

  if (previousGameName !== props.gameName) {
    previousGameName = props.gameName;
    getEditions(props.gameName)
      .then((editionsList) => {
        setList(() => {
          return <>{sendEditionList(editionsList)}</>;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return <>{List}</>;
}

export default Editions;
