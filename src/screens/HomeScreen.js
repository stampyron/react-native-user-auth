import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import { theme } from '../styles/theme';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  // Compute initials for the user avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            await logout();
            // Automatically transitions to AuthStack via RootNavigator!
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Header */}
        <View style={styles.topHeader}>
          <Text style={styles.appName}>UserAuthApp</Text>
          <View style={styles.activeBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.activeBadgeText}>Online</Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
          </View>

          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Valued User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'No email attached'}</Text>
        </View>

        {/* Session Details Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardHeader}>Session Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Status</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Authenticated</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Storage Backend</Text>
            <Text style={styles.infoValue}>AsyncStorage (Local)</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Session Persistence</Text>
            <Text style={styles.infoValue}>Enabled</Text>
          </View>
        </View>

        {/* Feature Highlights Card */}
        <View style={styles.featureCard}>
          <Text style={styles.cardHeader}>Security & Architecture</Text>
          <Text style={styles.featureBody}>
            Your session is persistently cached in local storage. You can safely close
            and relaunch this app without losing your authenticated session.
          </Text>
        </View>

        {/* Logout Action */}
        <View style={styles.actionsContainer}>
          <CustomButton
            title="Log Out"
            variant="danger"
            onPress={handleLogout}
            loading={loggingOut}
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  appName: {
    fontSize: theme.typography.titleSm.fontSize,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: 6,
  },
  activeBadgeText: {
    color: theme.colors.successText,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    alignItems: 'center',
    ...theme.shadows.card,
    marginBottom: theme.spacing.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.elevated,
  },
  avatarText: {
    color: theme.colors.textWhite,
    fontSize: 30,
    fontWeight: '700',
  },
  welcomeText: {
    fontSize: theme.typography.bodySm.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  userName: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.bodySm.fontSize,
    color: theme.colors.textMuted,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.subtle,
    marginBottom: theme.spacing.lg,
  },
  cardHeader: {
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: theme.typography.subtitle.fontWeight,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs + 2,
  },
  infoLabel: {
    fontSize: theme.typography.bodySm.fontSize,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: theme.typography.bodySm.fontSize,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  statusPill: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  statusPillText: {
    color: theme.colors.primaryDark,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  featureCard: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xxl,
  },
  featureBody: {
    fontSize: theme.typography.bodySm.fontSize,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  actionsContainer: {
    width: '100%',
    marginBottom: theme.spacing.xxl,
  },
  logoutButton: {
    width: '100%',
  },
});
