import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import anime from 'animejs/lib/anime.es.js';

function Error({ message, dis }) {

    const refs = useRef();
    const [ state, setState ] = useState(true);

    useEffect(() => {
        // ...
        var counts = {
            width: "0%"
        }

        anime({
            targets: counts,
            width: "100%",
            round: 1,
            easing: 'linear',
            duration: 2000,
            update: function() {
                refs.current.style.width = counts.width;
            },
            complete: function() {
                setState(false);
                dis();
            }
        });
    }, []);

    return ReactDOM.createPortal(
        <React.Fragment>
            { ( state ) ? (
            <div className="error">
                <h2>{ message }</h2>
                <div ref={refs} className="counts"></div>
            </div>) : null }

        </React.Fragment>,
        document.getElementById("root")
    );
}

export default Error;