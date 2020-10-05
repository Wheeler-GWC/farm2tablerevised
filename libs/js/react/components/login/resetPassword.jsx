"use strict";

const ResetPasswordComponent = React.createClass({
    getInitialState: function() {
        return {
            password: '',
            passwordConfirmation: '',
        };
    },

    onPasswordChanged: function(e) {
        this.setState({
            password: e.target.value
        });
    },

    onPasswordConfirmationChanged: function(e) {
        this.setState({
            passwordConfirmation: e.target.value
        });
    },

    submitChange: function(e) {
        $.post('api/password_recovery.php', {
            //email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.passwordConfirmation
        },
        function(res) {
            this.setState({successRegister: res});
            if(res == 'true') {
                //this.setState({email: ''});
                this.setState({password: ''});
                this.setState({passwordConfirmation: ''});
            }
        }.bind(this));
        e.preventDefault();
    },

    render: function() {
        return (
            <div>
                <form>
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" name="new_pass" onChange={this.onPasswordChanged}></input>
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="new_pass_c" onChange={this.onPasswordConfirmationChanged}></input>
                    </div>
                    <div className="form-group">
                        <button type="submit" name="new_password" onClick={this.submitChange}>Submit</button>
                    </div>
                </form>
            </div>
        );
    }
});