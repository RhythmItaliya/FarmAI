import React, { useCallback } from 'react';
import { View, Text, Button } from 'react-native';
import { TYPOGRAPHY, PADDING, GLOBAL } from '@/constants/globalStyle';
import { useAppNavigation } from '@/hooks/useAppNavigation';

const HomeSubScreen = React.memo(() => {
  const { goBack } = useAppNavigation();

  const handleGoBack = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <View style={[GLOBAL.flex, PADDING.md]}>
      <Text style={TYPOGRAPHY.heading}>Home Sub Screen</Text>
      <Button title="Go Back" onPress={handleGoBack} />
    </View>
  );
});

export default HomeSubScreen;
