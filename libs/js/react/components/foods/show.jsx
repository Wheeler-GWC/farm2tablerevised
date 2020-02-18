"use strict";

var ReadOneFoodComponent = React.createClass({
    getInitialState: function() {
        return {
            id: 0,
            item: '',
            quantity: 0,
            expire_date: ''
        };
    },

    componentDidMount: function() {
        var foodId = this.props.foodId;

        this.serverRequestFood = $.post('api/read_one_food.php',
            {food_id: foodId},
            function(food) {
                var p = JSON.parse(food)[0];
                this.setState({id: f.id});
                this.setState({item: f.item});
                this.setState({quantity: f.quantity});
                this.setState({expire_date: f.expire_date});
                $('.page-header h1').text(f.item);
            }.bind(this)
        );
    },

    componentWillUnmount: function() {
        this.serverRequestFood.abort();
    },

    render: function() {
        return (
            <div>
                <a href="#"
                   className="btn btn-primary margin-bottom-1em"
                >
                    All Items
                </a>

                <table className="table table-bordered table-responsive">
                    <tbody>
                    <tr>
                        <td>Item</td>
                        <td>{this.state.item}</td>
                    </tr>
                    <tr>
                        <td>Quantity</td>
                        <td>{this.state.quantity}</td>
                    </tr>
                    <tr>
                        <td>Expiration Date</td>
                        <td>{this.state.expire_date}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});