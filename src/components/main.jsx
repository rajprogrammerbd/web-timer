import React, { useReducer, useEffect, useRef } from 'react';
import music from "./alarm_clock.mp3";
import {Howl, Howler} from 'howler';
import Success from './success';
import Error from './error';

let sound;

function Main() {
    const initialState = {
        timer: {
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        start: false,
        ui: false,
        setTimer: {
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        successUI: false,
        error: { status: false, message: null }
    };


    useEffect(() => {
        sound = new Howl({
            src: [music],
            autoplay: false,
            loop: true,
            volume: 0.5
          });

        // Change global volume.
        Howler.volume(1);
    }, []);

    const startMusic = () => {
        sound.play();
    }

    const stopMusic = () => {
        sound.stop();
    }

    const intervalRef = useRef();

    const convertMiliseconds = ( h, m, s ) => {
        let result = 0;
        if ( h > 0 ) {
            result += (h * 3600000);
        }

        if ( m > 0 ) {
            result += (m * 60000);
        }

        if ( s > 0 ) {
            result += (s * 1000);
        }
    
        return result;
    }

    const reducer = ( state, action ) => {
        switch ( action.type ) {
            case 'addedInterval':
                return { ...state, timer: { hours: Math.floor(action.value / 3600), minutes: Math.floor(action.value / 60), seconds: (state.timer.seconds + action.custom === 60) ? 0 : state.timer.seconds + action.custom } };
            case 'setStart':
                return { ...state, start: action.value };
            case 'changeSetHours':
                return { ...state, setTimer: { ...state.setTimer, hours: action.value } };
            case 'changeSetMinutes':
                return { ...state, setTimer: { ...state.setTimer, minutes: action.value } };
            case 'changeSetSeconds':
                return { ...state, setTimer: { ...state.setTimer, seconds: action.value } };
            case 'changeTotallyTimer':
                return { ...state, timer: { hours: 0, minutes: 0, seconds: 0 } };
            case 'changeTotallyDefaultTimer':
                return { ...state, setTimer: { hours: 0, minutes: 0, seconds: 0 } };
            case 'changeUI':
                return { ...state, ui: action.value };
            case 'setDefaultTimer':
                return { ...state, timer: { hours: 0, minutes: 0, seconds: 0 } };
            case 'successUI':
                return { ...state, successUI: action.value };
            case 'successAll':
                return { ...state, successUI: false, ui: false };
            case 'setError':
                return { ...state, error: { status: action.status, message: action.message } };
            case 'defaultError':
                return { ...state, error: { status: false, message: null } };
            default:
                throw new Error("This is a Default Error");
        }
    }

    const count = { count: 0 };


    const intervalFunction = () => {
        count.count = count.count + 1;
        dispatch({ type: 'addedInterval', value: count.count, custom: 1 });
    }

    const [ state, dispatch ] = useReducer(reducer, initialState);

    const editButton = () => {
        if ( !state.start ) {
            if ( state.ui ) {
                dispatch({ type: 'changeUI', value: !state.ui });
            } else {
                dispatch({ type: 'setError', status: true, message: "Timer isn't started" });
                // throw new Error("Timer isn't started");
            } 
        } else {
            dispatch({ type: 'setError', status: true, message: "Timer haven't stopped" });
        }// throw new Error("Running Timer first stopped it then try");
    }

    const start = () => {
        intervalRef.current = window.setInterval(intervalFunction, 1000);

        window.setTimeout(() => {
            window.clearInterval(intervalRef.current);
            dispatch({ type: 'changeSetHours' });
            dispatch({ type: 'successUI', value:true });
        }, convertMiliseconds(state.setTimer.hours, state.setTimer.minutes, state.setTimer.seconds));
        dispatch({ type: 'setStart', value: !state.start });
    }

    const end = () => {
        window.clearInterval(intervalRef.current);
        dispatch({ type: 'changeTotallyTimer' });
        dispatch({ type: 'changeTotallyDefaultTimer' });
        dispatch({ type: 'setStart', value: false });
        dispatch({ type: 'successUI', value:true });
    }

    const hourChanged = e => {
        if ( Number(e.target.value) || Number(e.target.value) === 0 ) {
            // console.log(Number(e.target.value));
            if ( Number(e.target.value) >= 0 && Number(e.target.value) <= 12 ) {
                dispatch({ type: 'changeSetHours', value: Number(e.target.value) });
            } else {
                throw new Error("Hours is Invalid");
            }

        } else throw new Error("Typeof is String");
    }

    const minutesChanged = e => {
        if ( Number(e.target.value) || Number(e.target.value) === 0 ) {
            if ( Number(e.target.value) >= 0 && Number(e.target.value) <= 60 ) {
                dispatch({ type: 'changeSetMinutes', value: Number(e.target.value) });
            } else throw new Error("Minutes invalid");
            
        } else throw new Error("Typeof is String");
    }

    const secondChanged = e => {
        if ( Number(e.target.value) || Number(e.target.value) === 0 ) {
            if ( Number(e.target.value) >= 0 && Number(e.target.value) <= 60 ) {
                dispatch({ type: 'changeSetSeconds', value: Number(e.target.value) });
            } else throw new Error("Seconds Invalid");

        } else throw new Error("Typeof is String");
    }

    const setStarted = () => {
        dispatch({ type: 'changeUI', value: !state.ui });
        dispatch({ type: 'setDefaultTimer' });
        start();
    }

    const last = () => {
        stopMusic();
        dispatch({ type: 'successAll' });
    }

    const setDisableAnimation = () => {
        dispatch({ type: "defaultError" });
    }



    return (
        <React.Fragment>
            <main className="main">
                <div className="main-top">
                    <small onClick={editButton}>Edit</small>
                    { (state.ui) ? ( <h2 className="timer">{(state.timer.hours > 9) ? state.timer.hours : '0' + state.timer.hours}: {(state.timer.minutes > 9) ? state.timer.minutes : '0' + state.timer.minutes}: {(state.timer.seconds > 9) ? state.timer.seconds : '0' + state.timer.seconds}</h2> ) : (
                    <div className="input-items">
                        <form>
                            <input type="text" placeholder="Hours" onChange={hourChanged} />
                            <input type="text" placeholder="Minutes" onChange={minutesChanged} />
                            <input type="text" placeholder="Seconds" onChange={secondChanged} />
                        </form>
                    </div>) }
                    
                </div>
                <div className="main-bottom">
                    { (state.ui) ? (<button onClick={end} className="endButton" disabled={!state.start} >End</button>) : (<button className="start-button" onClick={setStarted} disabled={( state.setTimer.hours || state.setTimer.minutes || state.setTimer.seconds ) ? false : true}>Start</button>) }
                </div>
                { (state.successUI) ? <Success timer={state.timer} music={startMusic} last={last} /> : null }
                { (state.error.status) ? <Error message={state.error.message} dis={setDisableAnimation} /> : null }
            </main>
        </React.Fragment>
    );
}

export default Main;