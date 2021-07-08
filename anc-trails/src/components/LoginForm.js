import React, { Component } from 'react'

export default class LoginForm extends Component {

    constructor(props) {
        super();
        this.state = {
            username: '',
            password: ''
        }

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        return (
            <div id="login-container">
                <h3>Sign In</h3>
                <form className="form">
                    <div className="login-input">
                        <input type='text' name='name' autoComplete='off' required/>
                        <label for='username' className='label-name'>
                            <span className='content-name' >Username</span>
                        </label>
                    </div>

                    <div className="login-input">
                        <input type='text' name='name' autoComplete='off' required/>
                        <label for='password' className='label-name'>
                            <span className='content-name' >Password</span>
                        </label>
                    </div>

                    <button id="sign-in-btn" type="button">Sign In</button>
                </form>
            </div>
        )
    }
}
