import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { validateSignupForm } from '../utils/validation';
import { theme } from '../styles/theme';

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSignup = async () => {
    Keyboard.dismiss();
    setServerError('');

    const validation = validateSignupForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    const result = await signup(form.name, form.email, form.password);
    setLoading(false);

    if (!result.success) {
      setServerError(result.error || 'Registration failed. Please try again.');
    }
    // If successful, AuthContext updates user state, automatically redirecting to AppStack!
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header branding */}
            <View style={styles.header}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoBadgeText}>✨</Text>
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join us to get started with your account
              </Text>
            </View>

            {/* Error Banner */}
            {serverError ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{serverError}</Text>
              </View>
            ) : null}

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <CustomInput
                label="Full Name"
                value={form.name}
                onChangeText={(val) => updateField('name', val)}
                placeholder="John Doe"
                autoCapitalize="words"
                error={errors.name}
              />

              <CustomInput
                label="Email Address"
                value={form.email}
                onChangeText={(val) => updateField('email', val)}
                placeholder="name@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <CustomInput
                label="Password"
                value={form.password}
                onChangeText={(val) => updateField('password', val)}
                placeholder="At least 6 characters"
                secureTextEntry
                error={errors.password}
              />

              <CustomButton
                title="Sign Up"
                onPress={handleSignup}
                loading={loading}
                style={styles.signupButton}
              />
            </View>

            {/* Switch to Login */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <CustomButton
                title="Log In"
                variant="link"
                onPress={() => navigation.navigate('Login')}
                style={styles.linkButton}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  logoBadgeText: {
    fontSize: 28,
  },
  title: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.bodySm.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: theme.colors.errorLight,
    borderColor: theme.colors.borderError,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  errorBannerText: {
    color: theme.colors.errorText,
    fontSize: theme.typography.bodySm.fontSize,
    fontWeight: '500',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  signupButton: {
    marginTop: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.typography.bodySm.fontSize,
    color: theme.colors.textSecondary,
  },
  linkButton: {
    height: 'auto',
    paddingHorizontal: theme.spacing.xs,
  },
});
