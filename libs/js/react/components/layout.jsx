"use strict";

var NotFoundComponent = React.createClass({
    render: function() {
        return (
            <div>
                <div className="alert alert-danger">
                    <div className="text-center">
                        <h1 class="panel-title">
                            404
                        </h1>
                        <div className="panel-body">
                            <div className="">
                                Page not Found
                            </div>
                        </div>
                    </div>
                </div>
                <a class="btn btn-primary" href="#">Back to Home Page</a>
            </div>
        );
    }
});

var MainApp = React.createClass({
    getInitialState: function() {
        return {
            currentMode: 'read',
            foodId: null,
            isLoggedIn: '',
            user: ''
        };
    },

    logout: function() {
        $.get('api/logout.php', function(result) {
            if(result == 'ok')
                this.setState({
                    isLoggedIn: 'false',
                    user: ''
                });

            window.location.href = "#login";
        }.bind(this));
    },

    componentDidMount: function() {
        this.serverRequest = $.get('api/is_logged_in.php', function(result) {
            this.setState({
                isLoggedIn: result
            });
        }.bind(this));

        this.serverRequest = $.get('api/get_current_user.php', function(result) {
            if(result != '') {
                var u = JSON.parse(result)[0];
                this.setState({
                    user: u
                });
            }
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    changeAppMode: function(newMode, foodId) {
        this.setState({
            currentMode: newMode
        });

        if(foodId !== undefined) {
            this.setState({
                foodId: foodId
            });
        }
    },

    render: function() {

        const isAdmin = this.state.user.is_admin == 1 ? true : false;

        var defaultItemPerPage = 5;
        var defaultSearchText = "";
        var defaultCurrentPage = 1;
        var defaultOrderBy = 'f.item';
        var defaultOrderType = 'asc';

        var currentMode = this.props.location[0] || 'home';

        currentMode = currentMode.startsWith('update') ? (currentMode.split('?'))[0] : currentMode;
        currentMode = currentMode.startsWith('create') ? (currentMode.split('?'))[0] : currentMode;
        currentMode = currentMode.startsWith('page') ? (currentMode.split('='))[0] : currentMode;
        currentMode = currentMode.startsWith('search') ? (currentMode.split('='))[0] : currentMode;
        currentMode = currentMode.startsWith('show') ? (currentMode.split('?'))[0] : currentMode;
        currentMode = currentMode.startsWith('delete') ? (currentMode.split('?'))[0] : currentMode;
        currentMode = currentMode.startsWith('login') ? (currentMode.split('?'))[0] : currentMode;
        currentMode = currentMode.startsWith('register') ? (currentMode.split('?'))[0] : currentMode;
        currentMode = currentMode.startsWith('read') ? (currentMode.split('?'))[0] : currentMode;
        currentMode = currentMode.startsWith('reset') ? (currentMode.split('?'))[0] : currentMode;

        var foodId = 0;
        var searchedTerm = '';
        var sortColumn = 'f.item';
        var sortType = 'asc';
        var search = '';
        var order_by = 'f.item';
        var order_type = 'asc';
        var item_per_page = defaultItemPerPage;
        var itemPerPage = defaultItemPerPage;
        var initialPage = defaultCurrentPage;

        // Query string filter
        var pageParameterName = 'page';
        var searchParameterName = 'search';
        var orderByParameterName = 'order_by';
        var orderTypeParameterName = 'order_type';
        var itemPerPageParameterName = 'item_per_page';

        search = getParameterByName(searchParameterName);
        order_by = getParameterByName(orderByParameterName);
        order_type = getParameterByName(orderTypeParameterName);
        item_per_page = getParameterByName(itemPerPageParameterName);

        searchedTerm = (search === undefined) ? defaultSearchText : search;
        sortColumn = (order_by === undefined) ? defaultOrderBy : order_by;
        sortType = (order_type === undefined) ? defaultOrderType : order_type;
        itemPerPage = (item_per_page === undefined) ? defaultItemPerPage : item_per_page;

        var modeComponent = <HomepageComponent />;

        switch(currentMode) {
            case 'home':
                break;
            case 'read':
                modeComponent = <ReadFoodsComponent 
                                itemPerPage={defaultItemPerPage} 
                                currentPage={defaultCurrentPage} 
                                search={defaultSearchText} 
                                orderBy={defaultOrderBy} 
                                orderType={defaultOrderType}
                                isLoggedIn={this.state.isLoggedIn}
                                user={this.state.user}
                                isAdmin={isAdmin}
                            />;
                break;
            case 'page':
                initialPage = getParameterByName(pageParameterName);
                initialPage = parseInt(initialPage) <= 0 ? "1" : initialPage;
                modeComponent = <ReadFoodsComponent 
                                    itemPerPage={itemPerPage} 
                                    currentPage={initialPage} 
                                    search={searchedTerm} 
                                    orderBy={sortColumn} 
                                    orderType={sortType} 
                                    isLoggedIn={this.state.isLoggedIn}
                                    user={this.state.user}
                                    isAdmin={isAdmin}
                                />;
                break;
            case 'show':
                foodId = (this.props.location[0].split('?')[1]).split('=')[1];
                modeComponent = <ReadOneFoodComponent 
                                    foodId={foodId} 
                                    isLoggedIn={this.state.isLoggedIn}
                                    user={this.state.user}
                                    isAdmin={isAdmin}
                                />;
                break;
            case 'create':
                modeComponent = <CreateFoodComponent 
                                    changeAppMode={this.changeAppMode}
                                    isLoggedIn={this.state.isLoggedIn}
                                    user={this.state.user}
                                    isAdmin={isAdmin}
                                />;
                break;
            case 'update':
                foodId = (this.props.location[0].split('?')[1]).split('=')[1];
                modeComponent = <UpdateFoodComponent 
                                    foodId={foodId}
                                    isLoggedIn={this.state.isLoggedIn}
                                    user={this.state.user}
                                    isAdmin={isAdmin}
                                />;
                break;
            case 'delete':
                foodId = (this.props.location[0].split('?')[1]).split('=')[1];
                modeComponent = <DeleteFoodComponent 
                                    foodId={foodId} 
                                    isLoggedIn={this.state.isLoggedIn}
                                    user={this.state.user} 
                                    isAdmin={isAdmin}  
                                />;
                break;
            case 'login':
                modeComponent = <LoginComponent 
                                    isLoggedIn={this.state.isLoggedIn}
                                    user={this.state.user}
                                    isAdmin={isAdmin}
                                />;
                break;
            case 'register':
                modeComponent = <RegisterComponent
                                    isLoggedIn={this.state.isLoggedIn}
                                    user={this.state.user}
                                />;
                break;
            case 'ordersummary':
                modeComponent = isAdmin ?
                                <ReadOrdersComponent
                                    isLoggedIn={this.state.isLoggedIn}
                                    user={this.state.user}
                                    isAdmin={isAdmin}
                                /> :
                                <NotFoundComponent 
                                    isLoggedIn={this.state.isLoggedIn}
                                    user={this.state.user}
                                    isAdmin={isAdmin}
                                />;
                break;
            case 'reset':
                modeComponent = <ResetPasswordComponent 
                    token={window.location.href.split("token=")[1]}
                />
                break;
            default:
                $('.page-header').html('<h1>404</h1>');
                modeComponent = <NotFoundComponent 
                                    isLoggedIn={this.state.isLoggedIn}
                                    user={this.state.user}
                                    isAdmin={isAdmin}
                                />;
                break;
        }
        return (
            <div>
                {
                    <NavComponent
                        user={this.state.user}
                        isLoggedIn={this.state.isLoggedIn}
                        isAdmin={isAdmin}
                        logout={this.logout}
                    />
                }
                {
                    modeComponent
                }
            </div>
        );
    }
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?#&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function handleNewWindowLocation() {
    let location = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');
    ReactDOM.render(
        <MainApp location={location} />,
        document.getElementById('content')
    );
}

handleNewWindowLocation();

window.addEventListener('hashchange', handleNewWindowLocation, false);