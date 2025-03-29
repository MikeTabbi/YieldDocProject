import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { colors, typography, spacing, shadows } from '@/constants/theme';
import { Plane as Plant, ChartLine as LineChart, Leaf } from 'lucide-react-native';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Plant size={24} color={colors.accent} />
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Crops Scanned</Text>
        </View>
        <View style={styles.statCard}>
          <LineChart size={24} color={colors.accent} />
          <Text style={styles.statValue}>89%</Text>
          <Text style={styles.statLabel}>Avg. Health</Text>
        </View>
        <View style={styles.statCard}>
          <Leaf size={24} color={colors.accent} />
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Active Crops</Text>
        </View>
      </View>

      <View style={styles.actionsGrid}>
        {['Scan Crop', 'View Reports', 'Analytics', 'Settings'].map((action) => (
          <View key={action} style={styles.actionCard}>
            <Text style={styles.actionText}>{action}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  greeting: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.body,
    color: colors.text,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  statCard: {
    ...shadows.small,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    width: '30%',
  },
  statValue: {
    ...typography.subheading,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.md,
  },
  actionCard: {
    ...shadows.medium,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing.lg,
    width: '47%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    ...typography.body,
    color: colors.text,
  },
});