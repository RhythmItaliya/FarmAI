import React, { Suspense } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList, HomeStackParamList } from '@/types';

const LoginScreen = React.lazy(() => import('../screens/LoginScreen'));
const RegisterScreen = React.lazy(() => import('../screens/RegisterScreen'));
const OTPVerificationScreen = React.lazy(
  () => import('../screens/OTPVerificationScreen')
);
const HomeScreen = React.lazy(() => import('../screens/HomeScreen'));
const HomeSubScreen = React.lazy(() => import('../screens/home/HomeSubScreen'));

const RootStack = createStackNavigator<RootStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = React.memo(() => (
  <Suspense fallback={null}>
    <HomeStack.Navigator initialRouteName="HomeMain">
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="HomeSub" component={HomeSubScreen} />
    </HomeStack.Navigator>
  </Suspense>
));

const RootNavigator = React.memo(() => (
  <RootStack.Navigator initialRouteName="Login">
    <RootStack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="OTPVerification"
      component={OTPVerificationScreen}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="Home"
      component={HomeStackNavigator}
      options={{ headerShown: false }}
    />
  </RootStack.Navigator>
));

export default RootNavigator;
