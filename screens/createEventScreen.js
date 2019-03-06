import React from 'react';
import NavigationItems from './navigationItems';
import Colors from '../componenets/colors';
import CreateEvent from '../componenets/createEvent';
import Event from '../model/event';

export default class CreateEventScreen extends React.Component {
    static navigationOptions = {
        title: 'CREATE EVENT',
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
        const { navigation } = this.props;

        return (
            <CreateEvent
                event={navigation.getParam('event', new Event('', '', [''], '', ['']))}
                onSubmitEvent={() => {
                    navigation.navigate(NavigationItems.Home)
                }}
            />
        );
    }
}