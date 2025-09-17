import React, { Suspense } from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { RootStackParamList, HomeStackParamList } from '@/types';
import AuthGuard from '@/components/AuthGuard';

const LoginScreen = React.lazy(() => import('../screens/auth/LoginScreen'));
const RegisterScreen = React.lazy(
  () => import('../screens/auth/RegisterScreen')
);
const OTPVerificationScreen = React.lazy(
  () => import('../screens/auth/OTPVerificationScreen')
);
const OnboardingScreen = React.lazy(
  () => import('../screens/auth/OnboardingScreen')
);
const HomeScreen = React.lazy(() => import('../screens/HomeScreen'));
const HomeSubScreen = React.lazy(() => import('../screens/home/HomeSubScreen'));
const ProfileScreen = React.lazy(() => import('../screens/ProfileScreen'));

const RootStack = createStackNavigator<RootStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = React.memo(() => (
  <Suspense fallback={null}>
    <HomeStack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
        },
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <HomeStack.Screen
        name="HomeSub"
        component={HomeSubScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          gestureEnabled: true,
        }}
      />
    </HomeStack.Navigator>
  </Suspense>
));

const HomeScreenWithGuard = () => (
  <AuthGuard requireAuth={true}>
    <HomeStackNavigator />
  </AuthGuard>
);

const ProfileScreenWithGuard = () => (
  <AuthGuard requireAuth={true}>
    <ProfileScreen />
  </AuthGuard>
);

const RootNavigator = React.memo(() => {
  return (
    <Suspense fallback={null}>
      <RootStack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          cardStyleInterpolator: ({ current }) => {
            return {
              cardStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 0.5, 1],
                }),
              },
            };
          },
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 200,
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 200,
              },
            },
          },
        }}
      >
        <RootStack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            ...TransitionPresets.FadeFromBottomAndroid,
          }}
        />
        <RootStack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="OTPVerification"
          component={OTPVerificationScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="Home"
          component={HomeScreenWithGuard}
          options={{
            cardStyleInterpolator: ({ current }) => {
              return {
                cardStyle: {
                  opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              };
            },
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 150,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 150,
                },
              },
            },
          }}
        />
        <RootStack.Screen
          name="Profile"
          component={ProfileScreenWithGuard}
          options={{
            cardStyleInterpolator: ({ current }) => {
              return {
                cardStyle: {
                  opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              };
            },
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 150,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 150,
                },
              },
            },
          }}
        />
      </RootStack.Navigator>
    </Suspense>
  );
});

export default RootNavigator;
