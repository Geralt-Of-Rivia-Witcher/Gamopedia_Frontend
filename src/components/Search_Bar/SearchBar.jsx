import React, { useState } from "react";
import axios from "axios";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import  { useHistory } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';

let gameData;

const useStyles = makeStyles((theme) =>
({
    root:
    {
        '& .MuiTextField-root':
        {
            margin: theme.spacing(1),
            width: 1000,
        },
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
        {
            borderColor: "blue"
        },
        // "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
        // {
        //     borderColor: "blue"
        // },
        // "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
        // {
        //     borderColor: "blue"
        // }
    },
    input:
    {
        color: "white",
        height: "calc(110px + (55 - 110) * ((100vw - 300px) / (1600 - 300)))",
        fontSize: "calc(45px + (20 - 45) * ((100vw - 300px) / (1600 - 300)))"
    },
    button:
    {
        width: "1020px",
        height: "calc(65px + (40 - 65) * ((100vw - 300px) / (1600 - 300)))"
    },
    label:
    {
        color: 'white',
        fontSize: "calc(45px + (20 - 45) * ((100vw - 300px) / (1600 - 300)))"
    },
    helperText:
    {
        fontSize: "calc(30px + (15 - 30) * ((100vw - 300px) / (1600 - 300)))"
    }
}));

function SearchBar(props)
{
    let history = useHistory();
    const classes = useStyles();

    const [gameName, setGameName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(false);

    function handleChange(event)
    {
        setGameName(event.target.value);
    }

    function handleSubmit(event)
    {
        event.preventDefault();
        setGameName("");
        
        // axios.post("http://localhost:5000/api/gameName", { gameName: gameName })
        axios.post("https://gamopedia-backend.herokuapp.com/api/gameName", { gameName: gameName })
        .then((res) =>
        {
            gameData = res.data;
            if(gameData.detail === "Not found.")
            {
                history.push("/");
                setErrorMessage("Game not found. Check for any spelling mistakes.");
                setError(true);
            }
            else
            {
                history.push("/Game");
                setErrorMessage("");
                setError(false);
            }
            
        })
        .catch((error) =>
        {
            console.log(error);
        });
    }

    return (
        <form className={classes.root} noValidate autoComplete="off" onSubmit={ handleSubmit }>
            <TextField
                name="gameName"
                value = { gameName }
                onChange={ handleChange }
                error = { error }
                id="outlined-error-helper-text"
                label="Enter a Game Name."
                helperText={ errorMessage }
                variant="outlined"
                InputProps=
                {{
                    className: classes.input

                }}
                InputLabelProps=
                {{
                    className: classes.label
                }}
                FormHelperTextProps=
                {{
                    className: classes.helperText
                }}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button + " " + props.class}
                size="large"
            >
                <SearchIcon />
            </Button>

        </form>
    );
}

export { gameData, SearchBar };