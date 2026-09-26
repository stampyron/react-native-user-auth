import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { theme } from '../styles/theme';

export default function CustomInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  rightAccessory,
  containerStyle,
  inputStyle,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);

  const inputWrapperStyle = [
    styles.inputWrapper,
    isFocused && styles.inputWrapperFocused,
    hasError && styles.inputWrapperError,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={inputWrapperStyle}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightAccessory && (
          <View style={styles.rightAccessoryContainer}>{rightAccessory}</View>
        )}
      </View>
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
    width: '100%',
  },
  label: {
    fontSize: theme.typography.bodySm.fontSize,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs + 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.borderFocused,
    backgroundColor: theme.colors.surface,
  },
  inputWrapperError: {
    borderColor: theme.colors.borderError,
  },
  input: {
    flex: 1,
    height: '100%',
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
  },
  rightAccessoryContainer: {
    marginLeft: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.errorText,
    fontWeight: '500',
  },
});
