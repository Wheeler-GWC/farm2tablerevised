"use strict";

const OrderRow = React.createClass({
    getInitialState: function() {
        return {
            is_fulfilled: false
        };
    },

    componentDidMount: function() {
        this.setState({is_fulfilled: this.props.order.is_fulfilled});
    },

    markFulfilled: function() {
        this.props.markFulfilled(this.props.order.id);
        this.setState({is_fulfilled: 1});
    },

    render: function() {
        let is_fulfilled = this.state.is_fulfilled;
        return (
            <tr>
                <td>{this.props.order.email}</td>
                <td>{this.props.order.created_at}</td>
                <td>{this.props.order.item}</td>
                <td>{this.props.order.quantity}</td>
                <td>
                    {
                        (is_fulfilled == 1 || is_fulfilled == true) ?
                        <b>Ready for Pickup</b> :
                        <button className="btn btn-primary" onClick={this.markFulfilled}>Mark Fulfilled</button>
                    }
                </td>
            </tr>
        );
    }
});

const OrdersTable = React.createClass({
    render: function() {
        let rows = this.props.orders.map(function(order, i) {
            return (
                <OrderRow
                    key={i}
                    order={order}
                    isLoggedIn={this.props.isLoggedIn}
                    user={this.props.user}
                    isAdmin={this.props.isAdmin}
                    markFulfilled={this.props.markFulfilled}
                />
            );
        }.bind(this));
        return (
                <div className="container">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Time</th>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Fulfilled?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            );
    }
});

const ReadOrdersComponent = React.createClass({
    getInitialState: function() {
        return {
            search: this.props.search,
            currentPage: this.props.currentPage,
            limit: this.props.itemPerPage,
            orderBy: this.props.orderBy,
            orderType: this.props.orderType,
            orders: [],
            count: 0,
            loading: true,
            selectedRows: [],
            confirmationList: []
        };
    },
    
    componentDidMount: function() {
        this.populateOrders();
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    markFulfilled: function(orderId) {
        let r = confirm("Mark this order as fulfilled?");
        if (r == true) {
            $.post('api/fulfill_order.php',
                {order_id: orderId},
                function(res) {
                    console.log("Order marked as fulfilled.");
                }.bind(this)
            );
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

    populateOrders: function() {
        let parameters = {
            name: this.state.search,
            page: this.state.currentPage,
            item_per_page: this.state.limit,
            order_by: this.state.orderBy,
            order_type: this.state.orderType
        };
        this.serverRequest = $.get('api/read_all_orders.php', parameters,
            function(orders) {
                if(this.isMounted()) {
                    this.setState({
                        orders: JSON.parse(orders)
                    });
                }
            }.bind(this));

        this.serverRequest = $.get('api/count_all_order_items.php', parameters,
            function(data) {
                this.setState({
                    count: data,
                    loading: false
                });
            }.bind(this));
    },

    render: function() {
        let filteredOrders = this.state.orders;
        $('.page-header h1').text('Ordered Items');

        return (
            <div className="overflow-hidden container-fluid">
                <OrdersTable
                    orders={filteredOrders}
                    isLoggedIn={this.props.isLoggedIn}
                    user={this.props.user}
                    isAdmin={this.props.isAdmin}
                    markFulfilled={this.markFulfilled}
                />
            </div>
        );
    }
});
