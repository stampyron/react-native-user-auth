import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { theme } from '../styles/theme';

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) {
  const isLink = variant === 'link';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  const containerStyles = [
    styles.baseContainer,
    isLink && styles.linkContainer,
    isSecondary && styles.secondaryContainer,
    isDanger && styles.dangerContainer,
    !isLink && !isSecondary && !isDanger && styles.primaryContainer,
    (disabled || loading) && styles.disabledContainer,
    style,
  ];

  const textStyles = [
    styles.baseText,
    isLink && styles.linkText,
    isSecondary && styles.secondaryText,
    isDanger && styles.dangerText,
    !isLink && !isSecondary && !isDanger && styles.primaryText,
    (disabled || loading) && styles.disabledText,
    textStyle,
  ];

  const spinnerColor = isLink
    ? theme.colors.primary
    : isSecondary
    ? theme.colors.textPrimary
    : theme.colors.textWhite;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={containerStyles}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    height: 52,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
  },
  primaryContainer: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.subtle,
  },
  secondaryContainer: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dangerContainer: {
    backgroundColor: theme.colors.error,
    ...theme.shadows.subtle,
  },
  linkContainer: {
    backgroundColor: 'transparent',
    height: 44,
    paddingHorizontal: theme.spacing.xs,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: theme.spacing.sm,
  },
  baseText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  primaryText: {
    color: theme.colors.textWhite,
  },
  secondaryText: {
    color: theme.colors.textPrimary,
  },
  dangerText: {
    color: theme.colors.textWhite,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  disabledText: {
    color: theme.colors.textMuted,
  },
});
