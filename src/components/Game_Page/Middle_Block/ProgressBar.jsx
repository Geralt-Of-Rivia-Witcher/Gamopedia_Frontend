import React from "react";
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


function ProgressBar(props)
{
    return(
        <div 
            style=
            {{ 
                width: "calc(240px + (120 - 240) * ((100vw - 300px) / (1600 - 300)))", 
                height: "calc(240px + (120 - 240) * ((100vw - 300px) / (1600 - 300)))", 
                margin: "20px 50px 20px 0px", 
                display: "inline-block", 
                marginTop: "30px"
            }}
        >
            <CircularProgressbarWithChildren value={ props.score }
                styles=
                {
                    {
                        // Customize the root svg element
                        root: {},
                        // Customize the path, i.e. the "completed progress"
                        path:
                        {
                            // Path color
                            stroke: "#1A74E2",
                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: 'butt',
                            // Customize transition animation
                            transition: 'stroke-dashoffset 0.5s ease 0s',
                            // Rotate the path
                            // transform: 'rotate(0.25turn)',
                            transformOrigin: 'center center',
                        },
                        // Customize the circle behind the path, i.e. the "total progress"
                        trail:
                        {
                            // Trail color
                            stroke: '#d6d6d6',
                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: 'butt',
                            // Rotate the trail
                            transform: 'rotate(0.25turn)',
                            transformOrigin: 'center center',
                        },
                        // Customize the text
                        text:
                        {
                            // Text color
                            fill: 'white',
                            // Text size
                            fontSize: "20px"
                        },
                        // Customize background - only used when the `background` prop is true
                        background:
                        {
                            fill: '#3e98c7',
                        },
                    }
                }
            >
                <div 
                    style=
                    {{ 
                        fontSize: "calc(35px + (17 - 35) * ((100vw - 300px) / (1600 - 300)))", 
                        marginTop: -5, 
                        textAlign: "center", 
                        color: "white" 
                    }}
                >
                    { props.score }
                    <br />
                    <strong>{ props.platform }</strong>
                </div>
            </CircularProgressbarWithChildren>
        </div>
    );
}

export default ProgressBar;