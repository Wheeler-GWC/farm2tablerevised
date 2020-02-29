"use strict";

const FoodRow = React.createClass({
    getDateStyle: function() {
        let dateStyle;
        if (this.props.isExpired) {
            dateStyle = {
                color: 'red'
            };
        } else {
            dateStyle = {
                color: 'black'
            };
        }
        return dateStyle;
    },

    getOption: function(num) {
        return(<option>{num}</option>);
    },

    render: function() {
        let options = [];
        const dateStyle = this.getDateStyle();
        const food = this.props.food;
        for (let i = 0; i <= food.quantity; i++) {
            let option = this.getOption(i);
            options.push(option);
        }

        return (
            <tr style={dateStyle}>
                {
                    !!this.props.isAdmin ?
                    <td>
                        <input type="checkbox"
                            className='checkboxes'
                            checked={(this.props.selectedRows && this.props.selectedRows.indexOf(food.id)) >= 0}
                            onChange={(e) => this.props.toggleOne(e.target.checked, food.id)} />
                    </td>
                    :
                    <td>
                        <select 
                            className="form-control" 
                            onChange={(e) => this.props.selectFood(e.target.value,food.quantity,food.id)}
                        >
                            {options}
                        </select>
                    </td>
                }
                <td>{food.item}</td>
                <td>{food.quantity}</td>
                <td>{food.expire_date}</td>
                {
                    (this.props.isLoggedIn && !!this.props.isAdmin) &&
                        <td>
                            <a href={'#update?id='+food.id}
                               className="btn btn-primary m-r-1em">
                                Edit
                            </a>
                            <a href={'#delete?id='+food.id}
                               className="btn btn-danger">
                                Delete
                            </a>
                        </td>
                }
            </tr>
        );
    }
});

const FoodsTable = React.createClass({
    sortChanged: function(sortColumnName, order) {
        this.props.sortChanged(sortColumnName, order);
    },

    checkForExpiration: function(food) {
        return (
            food.expire_date != null && 
            food.expire_date != '' &&
            food.expire_date <= new Date().toISOString().slice(0,10)
        );
    },

    render: function() {
        let rows = this.props.foods.map(function(food, i) {
            const isExpired = this.checkForExpiration(food);
            return (
                (isExpired && !this.props.isAdmin) ?
                null :
                <FoodRow
                    key={i}
                    food={food}
                    changeAppMode={this.props.changeAppMode}
                    toggleOne={this.props.toggleOne}
                    selectedRows={this.props.selectedRows}
                    isLoggedIn={this.props.isLoggedIn}
                    user={this.props.user}
                    isAdmin={this.props.isAdmin}
                    isExpired={isExpired}
                    selectFood={this.props.selectFood}
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
                        {
                        !!this.props.isAdmin ?
                        <th className="text-center" style={{width:'1.5%'}}>
                            <input type="checkbox" onChange={this.props.toggleAll} />
                        </th>
                        :
                        <th style={{width:'8%'}}>
                            <a>
                                Quantity
                                <i className={this.props.sortClass('f.item')}></i>
                            </a>
                        </th>
                        }
                        <th style={{width:'20%'}}>
                            <a onClick={this.props.sortChanged.bind(null, 'f.item', this.props.orderType)}>
                                Item
                                <i className={this.props.sortClass('f.item')}></i>
                            </a>
                        </th>
                        <th style={{width:'20%'}}>
                            <a onClick={this.props.sortChanged.bind(null, 'quantity', this.props.orderType)}>
                                Number Available
                                <i className={this.props.sortClass('quantity')}></i>
                            </a>
                        </th>
                        <th style={{width:'30%'}}>
                            <a onClick={this.props.sortChanged.bind(null, 'expire_date', this.props.orderType)}>
                                Expiration Date
                                <i className={this.props.sortClass('expire_date')}></i>
                            </a>
                        </th>
                        {
                        !!this.props.isAdmin &&
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

const SearchByName = React.createClass({

    render: function() {
        return (
            <form role="search" action='#'>
                <div className="input-group col-md-3 margin-bottom-1em pull-left">
                    <input
                        type="text"
                        className="form-control searchbox"
                        placeholder="Type something..."
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

const TopActionsComponent = React.createClass({
    render: function() {
        return (
            <div className="">
                <SearchByName searchText={this.props.searchText} searchTerm={this.props.searchTerm} onInputSearchChange={this.props.onInputSearchChange} />

                {
                    (!!this.props.isLoggedIn && this.props.isAdmin)
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
                    :
                    !!this.props.user && 
                    <button data-toggle="modal" data-target="#confirmOrderModal" className="btn btn-success margin-bottom-1em pull-right" onClick={this.props.buildConfirmationList} style={{marginRight:'10px'}}>
                        Place Order
                    </button>
                }
            </div>
        );
    }
});

const Loader = React.createClass({
    render: function() {
        if(this.props.isLoading == true) {
            return <div className="text-center">Loading...</div>;
        }
        return null;
    }
});

const PaginationComponent = React.createClass({
    render: function() {

        let pagesAmount = Math.ceil(this.props.foodsAmount / this.props.foodsPerPage);
        let itemPerPage = this.props.foodsPerPage;
        let orderBy = this.props.orderBy;
        let orderType = this.props.orderType;
        let search = this.props.search;
        let appendUrl = '&search=' + search + '&order_by=' + orderBy + '&order_type=' + orderType + '&item_per_page=' + itemPerPage;

        let pageIndicators = [];
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

const ReadFoodsComponent = React.createClass({
    getInitialState: function() {
        return {
            search: this.props.search,
            currentPage: this.props.currentPage,
            limit: this.props.itemPerPage,
            orderBy: this.props.orderBy,
            orderType: this.props.orderType,
            foods: [],
            orderedFoods: [],
            count: 0,
            loading: true,
            selectedRows: [],
            confirmationList: []
        };
    },

    componentDidMount: function() {
        this.populateFoods();
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    populateFoods: function() {
        let parameters = {
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
        let page = parseInt(e.target.value);
        let totalPage = Math.ceil(this.state.count / this.state.limit);

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
            let selectedFoods = [];
            this.state.foods.forEach(function(food) {
                selectedFoods.push(food.id);
            });
            this.setState({selectedRows: selectedFoods});
        } else {
            this.setState({selectedRows: []});
        }
    },

    selectFood: function(num, available, id) {
        if (num > 0 && num <= available) {
            this.setState({
                orderedFoods: this.state.orderedFoods.concat({id: id, quantity: num})
            });
        } 
    },

    deleteSelected: function() {
        if(this.state.selectedRows.length > 0) {
            let r = confirm("Are you sure you want to delete the selected item(s)?");
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

    placeOrder: function() {
        if (this.state.orderedFoods.length > 0) {
            $.post('api/create_order.php',
                {
                    items: JSON.stringify(this.state.confirmationList),
                    userId: this.props.user.id
                },
                function (res) {
                    if (res == 'true' || res == 1) {
                        alert('Order Placed Successfully!');
                        this.setState({orderedFoods: []});
                        this.setState({confirmationList: []}, () => this.populateFoods());
                    } else {
                        alert('Order Failed! ', res);
                    }
                }.bind(this));
        } 
    },

    buildConfirmationList: function() {
        this.setState({confirmationList: this.state.orderedFoods});
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
        let filteredFoods;
        if (this.state.search === '') {
            filteredFoods = this.state.foods;
        } else {
            filteredFoods = this.state.foods.filter(food => food.item.toLowerCase().includes(this.state.search.toLowerCase()));
        }
        if(this.state.search != ''){
            $('.page-header h1').text('Search "'+ this.state.search +'"');
        }else{
            $('.page-header h1').text('All Items');
        }

        return (
            <div className="overflow-hidden container-fluid">
                <TopActionsComponent
                    searchText={this.state.search}
                    onInputSearchChange={this.onInputSearchChanged}
                    searchTerm={this.searchTerm}
                    deleteSelected={this.deleteSelected}
                    placeOrder={this.placeOrder}
                    isLoggedIn={this.props.isLoggedIn}
                    user={this.props.user}
                    isAdmin={this.props.isAdmin}
                    buildConfirmationList={this.buildConfirmationList}
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
                    isLoggedIn={this.props.isLoggedIn}
                    user={this.props.user}
                    isAdmin={this.props.isAdmin}
                    selectFood={this.selectFood}
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
                <ConfirmationModal
                    confirmationList={this.state.confirmationList}
                    placeOrder={this.placeOrder}
                />
            </div>
        );
    }
});

class ItemDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            item: '',
            quantity: 0
        }
    }

    componentDidMount() {
        this.getItemDetails();
    }

    getItemDetails() {
        this.serverRequestFood = $.post('api/read_one_food.php',
        {food_id: this.props.foodId},
        function(food) {
            const f = JSON.parse(food)[0];
            this.setState({id: f.id});
            this.setState({item: f.item});
            this.setState({quantity: this.props.quantity});
        }.bind(this));
    }
    
    render() {
        return(
            <p>{this.state.item} : {this.state.quantity}</p>
        );
    }
};

const ConfirmationModal = React.createClass({
    render() {
        return (
          <div className="modal" id="confirmOrderModal" tabindex="-1" z-index="1" role="dialog" aria-labelledby="modalCenterTitle" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title">Confirm Order</h3>
                    </div>
                    <div className="modal-body">
                        { this.props.confirmationList.length > 0 ?
                            this.props.confirmationList.map((i,key) => <ItemDetails key={key} foodId={i.id} quantity={i.quantity}/>)
                            : <p>Please select at least one item.</p>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                        <button type="button" disabled={this.props.confirmationList == 0} className="btn btn-success" onClick={this.props.placeOrder}>Confirm</button>
                    </div>
                </div>
              </div>
          </div>
        );
    }
});
