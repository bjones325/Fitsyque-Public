import { StackNavigator } from 'react-navigation';
import Splash from './Start/Splash';
import LoginScreen from './Start/LoginScreen';
import RegisterScreen from './Start/RegisterScreen';
import Contact from './Start/Contact';
import About from './Start/About';
import MainScreen from './Start/MainScreen';
import WorkoutsMain from './Workouts/WorkoutsMain';
import MacroScreen from './Macros/MacroScreen';
import AddMacro from './Macros/AddMacro';
import GraphScreen from './Graphs/GraphScreen';
import ImageGallery from './Measurements/ImageGallery';
import GoalsMain from './Goals/GoalMain'
import WorkoutListScreen from './Workouts/WorkoutListScreen'
import StrengthScreen from './Workouts/StrengthScreen'
import CardioScreen from './Workouts/CardioScreen'

import NavigationService from './NavigationService';

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
    Contact: {
        screen: Contact
    },
    About: {
        screen: About
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
    },
    WorkoutListScreen: {
        screen: WorkoutListScreen
    },
    StrengthScreen: {
        screen: StrengthScreen
    },
    CardioScreen: {
        screen: CardioScreen
    },
    AddMacro: {
        screen: AddMacro
    }
},
{
    initialRouteName: "Start",
    headerMode: 'none',
}
);