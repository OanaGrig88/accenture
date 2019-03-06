import React from 'react';
import { StyleSheet } from 'react-native';
import Login from '../componenets/login';
import Colors from '../componenets/colors';
import NavigationItems from './navigationItems';

export default class LoginScreen extends React.Component {
    static navigationOptions = {
        title: 'Accenture',
        headerStyle: {
            backgroundColor: Colors.pink,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
            fontWeight: 'bold',
        }
    };
  
    render() {
        const {navigate} = this.props.navigation;
    
        return (
            <Login 
                onLoginSuccess={() => {
                    navigate(NavigationItems.Home)
                }}

                onSignUp={() => {
                    navigate(NavigationItems.SignUp)
                }}

                onForgotPassword={() => {
                    // navigate(NavigationItems.ForgotPassword)
                }}
            />
        );
    }
}