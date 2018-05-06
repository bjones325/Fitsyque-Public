import { StackNavigator } from 'react-navigation';
import Splash from './Start/Splash';
import LoginScreen from './Start/LoginScreen';
import RegisterScreen from './Start/RegisterScreen';
import MainScreen from './Start/MainScreen';
import WorkoutsMain from './Workouts/WorkoutsMain';
import MacroScreen from './Macros/MacroScreen';
import GraphScreen from './Graphs/GraphScreen';
import ImageGallery from './Measurements/ImageGallery';
import GoalsMain from './Goals/GoalMain'

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
    },
    GoalsMain: {
        screen: GoalsMain
    }
},
{
    initialRouteName: "Start",
    headerMode: 'none',
}
);