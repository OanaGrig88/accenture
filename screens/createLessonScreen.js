import React from 'react';
import NavigationItems from './navigationItems';
import Colors from '../componenets/colors';
import CreateLesson from '../componenets/createLesson';
import Lesson from '../model/lesson';

export default class CreateLessonScreen extends React.Component {
    static navigationOptions = {
        title: 'INPUT NEW LESSON',
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
            <CreateLesson
                lesson={navigation.getParam('lesson', new Lesson('', ''))}
                onSubmitLesson={() => {
                    navigation.navigate(NavigationItems.Home)
                }}
            />
        );
    }
}