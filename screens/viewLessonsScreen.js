import React from 'react';
import ViewEvents from '../componenets/eventsList';
import Colors from '../componenets/colors';
import NavigationItems from './navigationItems'

export default class ViewLessonsScreen extends React.Component {
    static navigationOptions = {
        title: 'LESSONS',
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
                isEvent={false} 
                onEditLesson={(lesson) => {
                    navigate(NavigationItems.CreateLesson, {
                        lesson: lesson,
                    })
                }}
            />
        );
    }
}