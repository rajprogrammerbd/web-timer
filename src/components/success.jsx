import React from 'react';

function Success({ timer, last, music }) {
    music();

    return (
        <React.Fragment>
            <div className="success">
                <h2 className="success-title">Successfully Timer Completed</h2>
                <h3>{(timer.hours > 9) ? timer.hours : '0' + timer.hours}: {(timer.minutes > 9) ? timer.minutes : '0' + timer.minutes}: {(timer.seconds > 9) ? timer.seconds : '0' + timer.seconds}</h3>
                <button onClick={last}>OK</button>
            </div>
        </React.Fragment>
    );
}

export default Success;