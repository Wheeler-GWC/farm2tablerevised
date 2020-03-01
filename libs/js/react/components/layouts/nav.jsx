"use strict";

var NavComponent = React.createClass({

    render: function() {
        return(
            <div>
            {
                (this.props.isLoggedIn == 'false') ?

                <nav className="navbar navbar-expand-lg navbar-light navbar-fixed-top bg-light">
                    <a className="navbar-brand" href="#">Wheeler Farm To Table</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="container">
                        <div id="navbar" className="collapse navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li><a href="#">Home</a></li>
                                <li><a href="#login">Sign In</a></li>
                                <li><a href="#register">Sign Up</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                :
                <nav className="navbar navbar-expand-lg navbar-light navbar-fixed-top bg-light">
                    <a className="navbar-brand" href="#">Wheeler Farm To Table</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="container">
                        <div id="navbar" className="collapse navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li><a href="#">Home</a></li>
                                {
                                    (this.props.user != '') ?
                                    <li><a>Welcome, {this.props.user.email}</a></li>
                                    : null
                                }
                                {
                                    (!!this.props.isAdmin) ?
                                    <li><a href="#ordersummary">View Orders</a></li>
                                    : null
                                }
                                <li><a href="#logout" onClick={this.props.logout}>Sign Out</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            }
            </div>
        );
    }
});