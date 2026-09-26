import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { theme } from '../styles/theme';

export default function RootNavigator({ user = null, isLoading = false }) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
