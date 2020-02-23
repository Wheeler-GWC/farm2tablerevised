"use strict";

var UpdateFoodComponent = React.createClass({
    getInitialState:function() {
        return {
            id: 0,
            item: '',
            quantity: 0,
            expire_date: '',
            successUpdate: null,
            isLoggedIn: ''
        };
    },

    componentDidMount: function() {
        const foodId = this.props.foodId;
        this.serverRequestFood = $.post('api/read_one_food.php',
            {food_id: foodId},
            function(food) {
                const f = JSON.parse(food)[0];
                this.setState({id: f.id});
                this.setState({item: f.item});
                this.setState({quantity: f.quantity});
                this.setState({expire_date: f.expire_date});
                $('.page-header h1').text(f.item);
            }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequestFood.abort();
    },

    onNameChange: function(e) {
        this.setState({item: e.target.value});
    },

    onQuantityChange: function(e) {
        this.setState({quantity: e.target.value});
    },

    onExpireDateChange: function(e) {
        this.setState({expire_date: e.target.value});
    },

    onSave: function(e) {
        $.post('api/update_food.php', {
                id: this.state.id,
                item: this.state.item,
                quantity: this.state.quantity,
                expire_date: this.state.expire_date
            },
            function(res) {
                this.setState({successUpdate: res});
            }.bind(this));
        e.preventDefault();
    },

    render: function() {
        return (
            !!this.props.isAdmin ?
            <div>
                {
                    this.state.successUpdate == "true" ?
                        <div className="alert alert-success">
                            Item was updated.
                        </div>
                        : null
                }
                {
                    this.state.successUpdate != "true" && this.state.successUpdate != null ?
                        <div className="alert alert-danger">
                            {this.state.successUpdate}
                        </div>
                        : null
                }

                <a href="#"
                   className="btn btn-primary margin-bottom-1em"
                >
                    All Items
                </a>
                <form onSubmit={this.onSave}>
                    <table className="table table-bordered table-hover">
                        <tbody>
                        <tr>
                            <td>Item</td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.item}
                                    onChange={this.onNameChange}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Quantity</td>
                            <td>
                                    <input
                                        type="number"
                                        step="1"
                                        className="form-control"
                                        value={this.state.quantity}
                                        onChange={this.onQuantityChange}></input>
                            </td>
                        </tr>

                        <tr>
                            <td>Expiration Date</td>
                            <td>
                                <input
                                    type="date"
                                    value={this.state.expire_date}
                                    className="form-control"
                                    onChange={this.onExpireDateChange}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td></td>
                            <td>
                                <button className="btn btn-primary"
                                        onClick={this.onSave}>Save Changes</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </div>
            : <div>
                <h1>You must be an administrator to view this page</h1>
              </div>
        );
    }
});