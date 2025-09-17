/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/common/store';
import AuthInitializer from './src/components/AuthInitializer';
import GlobalLocationProvider from './src/components/GlobalLocationProvider';

enableScreens();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AuthInitializer>
            <GlobalLocationProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </GlobalLocationProvider>
          </AuthInitializer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
