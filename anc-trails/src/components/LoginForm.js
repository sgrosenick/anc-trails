import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { startLogin } from '../actions/actions';

class LoginForm extends Component {

    constructor(props) {
        super();
        this.state = {
            username: '',
            password: ''
        }


        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this)
    }

    static propTypes = {
        startLogin: PropTypes.object,
    }

    

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            username: this.state.username,
            password: this.state.password
        };

        
        //dispatch(startLogin(user));
        this.props.startLogin(user);
    }

    render() {
        return (
            <div id="login-container">
                <h3>Sign In</h3>
                <form className="form" onSubmit={this.onSubmit}>
                    <div className="login-input">
                        <input type='text' name='username' autoComplete='off' onChange={this.onChange} required/>
                        <label htmlFor='username' className='label-name'>
                            <span className='content-name' >Username</span>
                        </label>
                    </div>

                    <div className="login-input">
                        <input type='text' name='password' autoComplete='off' onChange={this.onChange} required/>
                        <label htmlFor='password' className='label-name'>
                            <span className='content-name' >Password</span>
                        </label>
                    </div>

                    <button id="sign-in-btn" type="submit">Sign In</button>
                </form>
            </div>
        )
    }
}


const mapStateToProps = state => {
    const { user } = state.tracksReducer;
    return { user };
}

LoginForm.propTypes = {
    startLogin: PropTypes.func.isRequired
}

export default connect(null, { startLogin })(LoginForm);