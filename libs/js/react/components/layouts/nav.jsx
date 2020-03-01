"use strict";

var NavComponent = React.createClass({

    render: function() {
        return(
            <div>
            {
                (this.props.isLoggedIn == 'false') ?

                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">Wheeler Farm To Table</a>
                        </div>

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
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">Wheeler Farm To Table</a>
                        </div>

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