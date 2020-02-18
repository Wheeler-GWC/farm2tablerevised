"use strict";

var CreateFoodComponent = React.createClass({
    getInitialState: function() {
        return {
            item: '',
            quantity: '',
            expire_date: '',
            successCreation: null,
            isLoggedIn: ''
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get('api/is_logged_in.php', function(result) {
            if(result == 'true')
                this.setState({
                    isLoggedIn: result
                });
            else
                window.location.href = '#';

        }.bind(this));

        $('.page-header h1').text('Create food item');
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    onNameChange: function(e) {
        this.setState({
            item: e.target.value
        });
    },

    onQuantityChange: function(e) {
        this.setState({
            quantity: e.target.value
        });
    },

    onExpireDateChange: function(e) {
        this.setState({
            expire_date: e.target.value
        });
    },

    defaultDate: function(expire_date) {
        if (!expire_date || expire_date == '') {
            return '9999-12-31';
        } else {
            return expire_date;
        }
    },

    onSave: function(e) {
        $.post('api/create_food.php', {
                item: this.state.item,
                quantity: this.state.quantity,
                expire_date: this.defaultDate(this.state.expire_date)
            },
            function(res) {
                this.setState({successCreation: res});
                if(res == 'true') {
                    this.setState({item: ''});
                    this.setState({quantity: ''});
                    this.setState({expire_date: ''});
                }
            }.bind(this));
        e.preventDefault();
    },

    render: function() {
        return (
            <div>
                {
                    this.state.successCreation == "true" ?
                        <div className="alert alert-success">
                            Item was saved.
                        </div>
                        : null
                }
                {
                    this.state.successCreation != "true" && this.state.successCreation != null ?
                        <div className="alert alert-danger">
                            {this.state.successCreation}
                        </div>
                        : null
                }

                <a href="#"
                   className="btn btn-primary margin-bottom-1em">
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
                                    required
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
                                    required
                                    min="0"
                                    onChange={this.onQuantityChange}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Expiration Date</td>
                            <td>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={this.state.expire_date}
                                    onChange={this.onExpireDateChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={this.onSave}>
                                    Save
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
});