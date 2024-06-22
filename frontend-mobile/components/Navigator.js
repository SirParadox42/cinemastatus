import {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import Rankings from '../screens/Rankings';
import ChooseSeries from '../screens/ChooseSeries';
import NewRanking from '../screens/NewRanking';
import SingleRanking from '../screens/SingleRanking';
import UpdateRanking from '../screens/UpdateRanking';
import UserRankings from '../screens/UserRankings';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Logout from './Logout';
import Profile from './Profile';
import {context} from '../store/context';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function Tabs() {
  return (
    <BottomTabs.Navigator screenOptions={{headerStyle: {backgroundColor: '#9d0000'}, headerTitleStyle: {fontFamily: 'Comfortaa'}, headerTintColor: 'white', tabBarStyle: {backgroundColor: '#9d0000'}, tabBarActiveTintColor: 'white', headerRight: () => <Logout/>}}>
      <BottomTabs.Screen name='Rankings' component={Rankings} options={{tabBarIcon: ({size, color}) => <Ionicons name='home' size={size} color={color}/>}}/>
      <BottomTabs.Screen name='Choose Series' component={ChooseSeries} options={{tabBarIcon: ({size, color}) => <Ionicons name='add' size={size} color={color}/>, tabBarLabel: 'New Ranking'}}/>
      <BottomTabs.Screen name='Your Rankings' component={UserRankings} options={{tabBarIcon: () => <Profile/>}} />
    </BottomTabs.Navigator>
  );
}

export default function Navigator() {
    const ctx = useContext(context);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: '#9d0000'}, headerTitleStyle: {fontFamily: 'Comfortaa'}, headerTintColor: 'white', contentStyle: {backgroundColor: '#ffcaca'}, headerRight: ctx.isLoggedIn ? () => <Logout/> : () => {}}}>
                {!ctx.isLoggedIn && (
                    <>
                        <Stack.Screen name='Login' component={Login}/>
                        <Stack.Screen name='Signup' component={Signup}/>
                    </>
                )}
                {ctx.isLoggedIn && (
                    <>
                        <Stack.Screen name='Tabs' component={Tabs} options={{headerShown: false}}/>
                        <Stack.Screen name='Ranking' component={SingleRanking}/>
                        <Stack.Screen name='New Ranking' component={NewRanking} options={{presentation: 'modal'}}/>
                        <Stack.Screen name='Update Ranking' component={UpdateRanking} options={{presentation: 'modal'}}/>
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}