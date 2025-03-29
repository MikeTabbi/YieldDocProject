import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Platform } from 'react-native';
import { useState } from 'react';
import { User, Bell, Sun, Moon, Wifi, Database, CircleHelp as HelpCircle, ChevronRight, LogOut } from 'lucide-react-native';
import { colors, typography, spacing, shadows } from '@/constants/theme';

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

type SettingsItemProps = {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  onPress?: () => void;
};

function SettingsItem({ icon, label, value, onPress }: SettingsItemProps) {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        {icon}
        <Text style={styles.settingsItemLabel}>{label}</Text>
      </View>
      <View style={styles.settingsItemRight}>
        {value}
        {onPress && <ChevronRight size={20} color={colors.text} style={{ opacity: 0.3 }} />}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <SettingsSection title="Account">
        <SettingsItem
          icon={<User size={24} color={colors.text} />}
          label="Profile"
          onPress={() => {}}
        />
      </SettingsSection>

      <SettingsSection title="Preferences">
        <SettingsItem
          icon={darkMode ? <Moon size={24} color={colors.text} /> : <Sun size={24} color={colors.text} />}
          label="Dark Mode"
          value={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : undefined}
            />
          }
        />
        <SettingsItem
          icon={<Bell size={24} color={colors.text} />}
          label="Notifications"
          value={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : undefined}
            />
          }
        />
        <SettingsItem
          icon={<Wifi size={24} color={colors.text} />}
          label="Offline Mode"
          value={
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : undefined}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title="Data">
        <SettingsItem
          icon={<Database size={24} color={colors.text} />}
          label="Storage Usage"
          onPress={() => {}}
        />
      </SettingsSection>

      <SettingsSection title="Support">
        <SettingsItem
          icon={<HelpCircle size={24} color={colors.text} />}
          label="Help & FAQ"
          onPress={() => {}}
        />
      </SettingsSection>

      <TouchableOpacity style={styles.logoutButton}>
        <LogOut size={24} color={colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
    backgroundColor: 'white',
    ...shadows.small,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text,
    opacity: 0.7,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: spacing.md,
    ...shadows.small,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingsItemLabel: {
    ...typography.body,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
    ...shadows.small,
  },
  logoutText: {
    ...typography.body,
    color: colors.error,
    fontFamily: 'Inter-SemiBold',
  },
  version: {
    ...typography.caption,
    color: colors.text,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});