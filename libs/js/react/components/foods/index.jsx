"use strict";

var FoodRow = React.createClass({
    render: function() {
        return (
            <tr>
                <td>
                    <input type="checkbox"
                           className='checkboxes'
                           checked={(this.props.selectedRows && this.props.selectedRows.indexOf(this.props.food.id)) >= 0}
                           onChange={(e) => this.props.toggleOne(e.target.checked, this.props.food.id)} />
                </td>
                <td>{this.props.food.item}</td>
                <td>{this.props.food.quantity}</td>
                <td>{this.props.food.expire_date}</td>
                {
                    (this.props.isLoggedIn && this.props.isAdmin)
                    ?
                        <td>
                            {/*<a href={'#show?id='+this.props.food.id}
                               className="btn btn-info m-r-1em">
                                View
                            </a>*/}
                            <a href={'#update?id='+this.props.food.id}
                               className="btn btn-primary m-r-1em">
                                Edit
                            </a>
                            <a href={'#delete?id='+this.props.food.id}
                               className="btn btn-danger">
                                Delete
                            </a>
                        </td>
                    :
                        {/*
                        <td>
                            <a href={'#show?id='+this.props.food.id}
                               className="btn btn-info m-r-1em">
                                View
                            </a>
                        </td>
                        */}
                }
            </tr>
        );
    }
});

var FoodsTable = React.createClass({
    sortChanged: function(sortColumnName, order) {
        this.props.sortChanged(sortColumnName, order);
    },

    render: function() {
        var rows = this.props.foods.map(function(food, i) {
            return (
                <FoodRow
                    key={i}
                    food={food}
                    changeAppMode={this.props.changeAppMode}
                    toggleOne={this.props.toggleOne}
                    selectedRows={this.props.selectedRows}
                    isLoggedIn={this.props.isLoggedIn}
                    isAdmin={this.props.isAdmin}
                />
            );
        }.bind(this));

        return (
            !rows.length
                ? <div className="alert alert-danger" style={{marginTop:50}}>No items found.</div>
                :
                <table className="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th className="text-center" style={{width:'1.5%'}}>
                            <input type="checkbox" onChange={this.props.toggleAll} />
                        </th>
                        <th style={{width:'20%'}}>
                            <a onClick={this.props.sortChanged.bind(null, 'f.item', this.props.orderType)}>
                                Item
                                <i className={this.props.sortClass('f.item')}></i>
                            </a>
                        </th>
                        <th style={{width:'40%'}}>
                            <a onClick={this.props.sortChanged.bind(null, 'quantity', this.props.orderType)}>
                                Quantity
                                <i className={this.props.sortClass('quantity')}></i>
                            </a>
                        </th>
                        <th style={{width:'9%'}}>
                            <a onClick={this.props.sortChanged.bind(null, 'expire_date', this.props.orderType)}>
                                Expiration Date
                                <i className={this.props.sortClass('expire_date')}></i>
                            </a>
                        </th>
                        {
                            this.props.isLoggedIn &&
                            this.props.isAdmin &&
                            <th>Action</th>
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
        );
    }
});

var SearchByName = React.createClass({

    render: function() {
        return (
            <form role="search" action='#'>
                <div className="input-group col-md-3 margin-bottom-1em pull-left">
                    <input
                        type="text"
                        className="form-control searchbox"
                        placeholder="Type a name..."
                        required
                        onChange={this.props.onInputSearchChange} value={this.props.searchText} />
                    <div className="input-group-btn">
                        <button className="btn btn-primary" onClick={this.props.searchTerm}>
                            Search
                        </button>
                    </div>
                </div>
            </form>
        );
    }
});

var TopActionsComponent = React.createClass({
    render: function() {
        return (
            <div className="">
                <SearchByName searchText={this.props.searchText} searchTerm={this.props.searchTerm} onInputSearchChange={this.props.onInputSearchChange} />

                {
                    (this.props.isLoggedIn == 'true')
                    ?
                        <div>
                            <a href="#create" className="btn btn-primary margin-bottom-1em pull-right" >
                                <span className='glyphicon glyphicon-plus'></span>&nbsp;
                                Create Item
                            </a>

                            <button className="btn btn-danger margin-bottom-1em pull-right" onClick={this.props.deleteSelected} style={{marginRight:'10px'}}>
                                <span className='glyphicon glyphicon-trash'></span>&nbsp;
                                Delete Selected Items
                            </button>
                        </div>
                    : null
                }
            </div>
        );
    }
});

var Loader = React.createClass({
    render: function() {
        if(this.props.isLoading == true) {
            return <div className="text-center">Loading...</div>;
        }
        return null;
    }
});

var PaginationComponent = React.createClass({
    render: function() {

        var pagesAmount = Math.ceil(this.props.foodsAmount / this.props.foodsPerPage);
        var itemPerPage = this.props.foodsPerPage;
        var orderBy = this.props.orderBy;
        var orderType = this.props.orderType;
        var search = this.props.search;
        var appendUrl = '&search=' + search + '&order_by=' + orderBy + '&order_type=' + orderType + '&item_per_page=' + itemPerPage;

        var pageIndicators = [];
        for (let i=1; i <= pagesAmount; i++) {
            pageIndicators.push(
                <li className={i == this.props.currentPage ? "active":""} key={i}>
                    <a href={'#page=' + i + appendUrl} onClick={this.props.onPageChanged.bind(null, i)}>{i}</a>
                </li>
            )
        }

        return (
            !this.props.foodsAmount ? null :
                <nav className='overflow-hidden' style={{marginBottom:'20px'}}>
                    {
                        (pagesAmount - 1) <= 0 ? null :
                        <ul className='pagination pull-left margin-zero'>
                            {
                                this.props.currentPage == 1 ? null :
                                    <li>
                                        <a href={'#page=1' + appendUrl} onClick={this.props.onPageChanged.bind(null,1)}>
                                            <span style={{marginRight: '0 .5em'}}>&laquo;</span>
                                        </a>
                                    </li>
                            }

                            {
                                this.props.currentPage == 1 ? null :
                                    <li>
                                        <a href={'#page='+ (this.props.currentPage - 1) + appendUrl} onClick={this.props.onPageChanged.bind(null,1)}>
                                            <span style={{marginRight: '0 .5em'}}>&lsaquo;</span>
                                        </a>
                                    </li>
                            }

                            { pageIndicators }

                            {
                                this.props.currentPage == pagesAmount ? null :
                                    <li>
                                        <a href={'#page='+ (parseInt(this.props.currentPage) + 1) + appendUrl} onClick={this.props.onPageChanged.bind(null, pagesAmount)}>
                                            <span style={{marginRight: '0 .5em'}}>&rsaquo;</span>
                                        </a>
                                    </li>
                            }

                            {
                                this.props.currentPage == pagesAmount ? null :
                                    <li>
                                        <a href={'#page=' + pagesAmount + appendUrl} onClick={this.props.onPageChanged.bind(null, pagesAmount)}>
                                            <span style={{marginRight: '0 .5em'}}>&raquo;</span>
                                        </a>
                                    </li>
                            }
                        </ul>
                    }

                    <form method="get" action="#">
                        <div className="input-group col-md-2 pull-right">
                            <input type="hidden" name="s" value="" />
                            <input type="number"
                                   className="form-control"
                                   name="page"
                                   min='1'
                                   max={pagesAmount}
                                   required
                                   placeholder='Go to page'
                                   onChange={this.props.onInputPageChange} />

                            <div className="input-group-btn">
                                <button className="btn btn-primary" onClick={this.props.goToInputPage}>
                                    Go
                                </button>
                            </div>
                        </div>

                        <div className="input-group col-md-3 pull-right" style={{marginRight:'10px'}}>
                            <select value={this.props.foodsPerPage} name="" className="form-control" onChange={this.props.itemPerPageChanged}>
                                <option value="5">Show 5 Items per page</option>
                                <option value="10">Show 10 Items per page</option>
                                <option value="25">Show 25 Items per page</option>
                            </select>
                        </div>
                    </form>
                </nav>
        );
    }
});

var ReadFoodsComponent = React.createClass({
    getInitialState: function() {
        return {
            search: this.props.search,
            currentPage: this.props.currentPage,
            limit: this.props.itemPerPage,
            orderBy: this.props.orderBy,
            orderType: this.props.orderType,
            foods: [],
            count: 0,
            loading: true,
            selectedRows: [],
            isLoggedIn: '',
            isAdmin: false
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get('api/is_logged_in.php', function(result) {
            this.setState({
                isLoggedIn: result
            });
        }.bind(this));

        this.serverRequest = $.get('api/get_current_user.php', function(result) {
            console.log('RESULT: ', JSON.parse(result)[0]);
            const isAdmin = JSON.parse(result)[0].is_admin;
            if (isAdmin === 1 || isAdmin === '1') {
                this.setState({
                    isAdmin: isAdmin
                });
            }
        }.bind(this));
        console.log('Is Admin: ', this.state.isAdmin);
        this.populateFoods();
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    populateFoods: function() {
        var parameters = {
            name: this.state.search,
            page: this.state.currentPage,
            item_per_page: this.state.limit,
            order_by: this.state.orderBy,
            order_type: this.state.orderType
        };

        this.serverRequest = $.get('api/read_all_foods.php', parameters,
            function(foods) {
                if(this.isMounted()) {
                    this.setState({
                        foods: JSON.parse(foods)
                    });
                }
            }.bind(this));

        this.serverRequest = $.get('api/count_all_foods.php', parameters,
            function(data) {
                this.setState({
                    count: data,
                    loading: false
                });
            }.bind(this));
    },

    onInputPageChange: function(e) {
        var page = parseInt(e.target.value);
        var totalPage = Math.ceil(this.state.count / this.state.limit);

        if(page > totalPage) {
            page = totalPage;
        } else if(page <= 0) {
            page = 1;
        }

        this.setState({currentPage: page});
    },

    goToInputPage: function(e) {
        e.preventDefault();
        if(this.state.currentPage){
            this.pageChanged(this.state.currentPage);
        }
    },

    pageChanged: function(destPage, e) {
        window.location.replace('#page=' + destPage + '&search=' + this.state.search + '&order_by=' + this.state.orderBy + '&order_type=' + this.state.orderType + '&item_per_page=' + this.state.limit);

        /**
         * setState() does not immediately mutate this.state but creates a pending state transition. Accessing this.state after calling this method
         * can potentially return the existing value. There is no guarantee of synchronous operation of calls to setState and calls may be batched
         * for performance gains.
         */
        this.setState({
            currentPage: destPage
        }, function() {
            this.populateFoods();
        });
    },

    sortChanged : function(sortColumnName, order){
        this.setState({
            orderBy: sortColumnName,
            orderType: order.toString().toLowerCase() == 'asc' ? 'desc' : 'asc',
            currentPage: 1
        }, function() {
            this.populateFoods();
            this.pageChanged(1);
        });
    },

    sortClass : function(filterName){
        return "fa fa-fw " + ((filterName == this.state.orderBy) ? ("fa-sort-" + this.state.orderType) : "fa-sort");
    },

    searchTerm: function(e) {
        window.location.replace('#page=' + this.state.currentPage + '&search=' + this.state.search + '&order_by=' + this.state.orderBy + '&order_type=' + this.state.orderType + '&item_per_page=' + this.state.limit);
        if(!e.target.value) {
            this.setState({
                currentPage: 1
            }, function() {
                this.populateFoods();
                this.pageChanged(1);
            });
        } else {
            this.setState({search: e.target.value});
        }
        e.preventDefault();
    },

    onInputSearchChanged: function(e) {
        if(!e.target.value){
            window.location.replace('#');
            this.setState({
                search: e.target.value
            }, function() {
                this.populateFoods();
                this.pageChanged(1);
            });
        } else {
            this.setState({
                search: e.target.value
            });
        }
    },

    toggleOne: function(checked, id) {
        if(checked){
            this.setState({
                selectedRows: this.state.selectedRows.concat([id])
            });
        }else {
            this.setState({
                selectedRows: this.state.selectedRows.filter((el) => el !== id)
            });
        }
    },

    toggleAll: function(e) {
        if(e.target.checked) {
            var selectedFoods = [];
            this.state.foods.forEach(function(food) {
                selectedFoods.push(food.id);
            });
            this.setState({selectedRows: selectedFoods});
        } else {
            this.setState({selectedRows: []});
        }
    },

    deleteSelected: function() {
        if(this.state.selectedRows.length > 0) {
            var r = confirm("Are you sure you want to delete the selected item(s)?");
            if (r == true) {
                $.post('api/delete_foods.php',
                    {del_ids: this.state.selectedRows},
                    function (res) {
                        if (res == 'true') {
                            this.setState({
                                foods: this.state.foods.filter((el) =>
                                this.state.selectedRows.indexOf(el.id) < 0)
                            });
                            this.setState({selectedRows: []});
                            this.populateFoods();
                            this.pageChanged(1);
                        } else {
                            alert("Unable to delete food(s).");
                        }
                    }.bind(this)
                );
            }
        } else {
            alert('Please select one or more items to be deleted.');
        }
    },

    itemPerPageChanged: function(e) {
        this.setState({
            limit: e.target.value,
            currentPage: 1
        }, function() {
            this.populateFoods();
            this.pageChanged(1);
        });
    },

    render: function() {
        var filteredFoods = this.state.foods;
        if(this.state.search != ''){
            $('.page-header h1').text('Search "'+ this.state.search +'"');
        }else{
            $('.page-header h1').text('All Items');
        }

        return (
            <div className="overflow-hidden">
                <TopActionsComponent
                    searchText={this.state.search}
                    onInputSearchChange={this.onInputSearchChanged}
                    searchTerm={this.searchTerm}
                    deleteSelected={this.deleteSelected}
                    isLoggedIn={this.state.isLoggedIn}
                />

                <Loader isLoading={this.state.loading} />
                <FoodsTable
                    toggleAll={this.toggleAll}
                    toggleOne={this.toggleOne}
                    foods={filteredFoods}
                    orderBy={this.state.orderBy}
                    orderType={this.state.orderType}
                    sortClass={this.sortClass}
                    sortChanged={this.sortChanged}
                    selectedRows={this.state.selectedRows}
                    isLoggedIn={this.state.isLoggedIn}
                    isAdmin={this.state.isAdmin}
                />

                <PaginationComponent
                    currentPage={this.props.currentPage}
                    search={this.props.search}
                    foodsPerPage={parseInt(this.state.limit)}
                    foodsAmount={this.state.count}
                    onPageChanged={this.pageChanged}
                    itemPerPageChanged={this.itemPerPageChanged}
                    onInputPageChange={this.onInputPageChange}
                    goToInputPage={this.goToInputPage}
                    orderBy={this.props.orderBy}
                    orderType={this.props.orderType} />
            </div>
        );
    }
});