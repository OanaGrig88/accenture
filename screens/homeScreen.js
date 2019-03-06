import React from 'react';
import Home from '../componenets/home';
import NavigationItems from './navigationItems';

export default class HomeScreen extends React.Component {
    static navigationOptions = {
      header: null
    };
  
    render() {
        const {navigate} = this.props.navigation;
    
        return (
            <Home 
                onViewEvents={() => {
                    navigate(NavigationItems.ViewEvents);
                }}

                onViewLessons={() => {
                    navigate(NavigationItems.ViewLessons)
                }}

                onCreateEvent={() => {
                    navigate(NavigationItems.CreateEvent);
                }}

                onCreateLesson={() => {
                    navigate(NavigationItems.CreateLesson);
                }}
            />
        );
    }
}