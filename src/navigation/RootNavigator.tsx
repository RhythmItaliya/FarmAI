import React, { Suspense } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList, HomeStackParamList } from '@/types';
import AuthGuard from '../components/AuthGuard';

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

const HomeScreenWithGuard = () => (
  <AuthGuard requireAuth={true}>
    <HomeStackNavigator />
  </AuthGuard>
);

const RootNavigator = React.memo(() => {
  return (
    <Suspense fallback={null}>
      <RootStack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
        <RootStack.Screen
          name="OTPVerification"
          component={OTPVerificationScreen}
        />
        <RootStack.Screen name="Home" component={HomeScreenWithGuard} />
      </RootStack.Navigator>
    </Suspense>
  );
});

export default RootNavigator;
