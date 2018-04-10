import { StackNavigator } from 'react-navigation';
import Splash from './Splash';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import MainScreen from './MainScreen';
import WorkoutsMain from './Workouts/WorkoutsMain';
import MacroScreen from './Macros/MacroScreen';
import GraphScreen from './Graphs/GraphScreen';
import ImageGallery from './Measurements/ImageGallery';

export const RootStack = StackNavigator({
    Start: {
        screen: Splash,
    },
    Login: {
        screen: LoginScreen
    },
    Register: {
        screen: RegisterScreen
    },
    MainScreen: {
        screen: MainScreen
    },
    WorkoutsMain: {
        screen: WorkoutsMain
    },
    MacronutrientMain: {
        screen: MacroScreen
    },
    GraphScreen: {
        screen: GraphScreen
    },
    ImageGallery: {
        screen: ImageGallery
    }
},
{
    initialRouteName: "Start",
    headerMode: 'none',
}
);