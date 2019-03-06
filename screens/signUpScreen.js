import React from 'react';
import NavigationItems from './navigationItems';
import SignUp from '../componenets/signup';


export default class SignUpScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
  
    render() {
        const {navigate} = this.props.navigation;
    
        return (
            <SignUp
                onSignUp={() => {
                    navigate(NavigationItems.Home)
                }}

                onBackToLogin={() => {
                    navigate(NavigationItems.Login)
                }}
            />
        );
    }
}