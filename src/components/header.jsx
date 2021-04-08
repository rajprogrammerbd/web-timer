import React from 'react';

function Header() {
    return (
        <React.Fragment>
            <header>
                <div className="container">
                    <div id="header">
                        <h2 className="title"><a href="/">Web-Timer</a></h2>
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
}

export default Header;