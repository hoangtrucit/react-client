import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import {Link} from 'react-router';
import {push} from 'react-router-redux';
import {Col, Container, Card, CardHeader, CardBlock} from 'reactstrap';
import validator from 'validator';
import {bindActionCreators} from 'redux';
import {InputText} from '../../../components/form';
import {Toaster} from '../../../components/layouts';
import {AuthApi} from '../../../api';
import {storageKey} from '../../../config';
import {authAction} from '../../../redux/actions/authAction';
import {graphql} from 'react-apollo';
import gpl from 'graphql-tag';
import {autobind} from 'core-decorators';
import {connect} from 'react-redux'
import swal from 'sweetalert2';

const fields = ['username', 'password'];

const validate = (values) => {
    let errors = {};
    if (!values.username) errors.username = 'Please enter email';
    if (!values.password) errors.password = 'Please enter password';
    // if (values.email && !validator.isEmail(values.email)) {
    //     errors.email = 'Email incorrect';
    // }
    return errors;
}



const mutationLogin = gpl`
    mutation Login($username: String!, $password: String){
        loginUser(username: $username, password: $password){
            token,
            success,
            user{
                usr_id,
                usr_name
            }
        }
    }
`
@reduxForm({
    form: 'loginForm',
    fields,
    validate
})
@graphql(mutationLogin, {name: 'loginUser'})
@connect(() => ({}), dispatch => bindActionCreators({...authAction, push}, dispatch))
export default class Login extends Component {
    static propTypes = {
        loginUser: PropTypes.func
    }

    @autobind
    handleSubmit(values) {
        const {username, password} = values;
        this.props.loginUser({
            variables: {
                username,
                password
            }
        }).then(userRes => {
            const {loginUser: {success, token, user}} = userRes.data;
            
            if(success){
                this.props.setAuthUser({token, user});
                swal({
                    title: 'Login Success'
                }).then(() => {
                    this.props.push('/');
                })
            }
        })
    }

    render() {
        const {fields: {username, password}, handleSubmit, submitting} = this.props;
        return (
            <Container className="margin-top-50">
                <Col md={{size: 6, offset: 3}}>
                    <Card>
                        <CardHeader><i className="icon-login"/> Login</CardHeader>
                        <CardBlock>
                            <form onSubmit={handleSubmit(this.handleSubmit)}>
                                <InputText title="Email" {...username} />
                                <InputText title="Mật khẩu" type="password" {...password} />
                                <button className="btn btn-primary btn-block" disabled={submitting}>Login</button>
                            </form>
                            <div className="text-center margin-top-20">
                                <Link to="/auth/register">Register account</Link><br/>
                                <Link to="/auth/forgot-password">Forgot password</Link>
                            </div>
                        </CardBlock>
                    </Card>
                </Col>
            </Container>
        )
    }
}
Login.propTypes = {}