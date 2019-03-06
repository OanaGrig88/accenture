import React from 'react';
import ViewEvents from '../componenets/eventsList';
import Colors from '../componenets/colors';
import NavigationItems from './navigationItems'

export default class ViewEventsScreen extends React.Component {
    static navigationOptions = {
        title: 'EVENTS',
        headerStyle: {
          backgroundColor: Colors.pink,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 16,
        },
    };
  
    render() {
        const {navigate} = this.props.navigation;
    
        return (
            <ViewEvents 
                isEvent={true} 
                onEditEvent={(event) => {
                    navigate(NavigationItems.CreateEvent, {
                        event: event,
                    })
                }}
            />
        );
    }
}