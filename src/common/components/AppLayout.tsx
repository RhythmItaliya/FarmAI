import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeaderBar from './HeaderBar';
import BottomBar from './BottomBar';
import { COLORS, GLOBAL } from '@/constants/globalStyle';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showUserInfo?: boolean;
  showBottomBar?: boolean;
  activeTab?: string;
  rightComponent?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  showUserInfo = true,
  showBottomBar = true,
  activeTab = 'home',
  rightComponent,
}) => {
  return (
    <View style={[GLOBAL.flex, { backgroundColor: COLORS.background }]}>
      <HeaderBar
        title={title}
        showBackButton={showBackButton}
        showUserInfo={showUserInfo}
        rightComponent={rightComponent}
      />

      <View style={styles.content}>{children}</View>

      {showBottomBar && <BottomBar activeTab={activeTab} />}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

export default AppLayout;
