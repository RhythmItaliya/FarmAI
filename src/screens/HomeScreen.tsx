import React, { useCallback } from 'react';
import { View, Text, Button } from 'react-native';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { GLOBAL, PADDING, TYPOGRAPHY } from '../constants/globalStyle';

const HomeScreen = React.memo(() => {
  const { navigate } = useAppNavigation();

  const handleGoToSub = useCallback(() => {
    navigate('HomeSub');
  }, [navigate]);

  return (
    <View style={[GLOBAL.flex, PADDING.md]}>
      <Text style={TYPOGRAPHY.heading}>Home Screen</Text>
      <Button title="Go to Home Sub Screen" onPress={handleGoToSub} />
    </View>
  );
});

export default HomeScreen;
