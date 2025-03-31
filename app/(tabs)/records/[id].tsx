import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, Leaf, Droplets, Sun, Wind } from 'lucide-react-native';
import { colors, typography, spacing, shadows } from '@/constants/theme';

const mockData = {
  '1': {
    id: '1',
    date: new Date('2024-02-20'),
    cropType: 'Tomatoes',
    healthScore: 95,
    imageUrl: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?q=80&w=800&auto=format&fit=crop',
    details: {
      soilMoisture: '72%',
      sunlight: '85%',
      airQuality: '90%',
      temperature: '24°C',
      recommendations: [
        'Maintain current watering schedule',
        'Consider light pruning in the next week',
        'Monitor for early signs of pests',
      ],
    },
  },
  '2': {
    id: '2',
    date: new Date('2024-02-19'),
    cropType: 'Lettuce',
    healthScore: 88,
    imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=800&auto=format&fit=crop',
    details: {
      soilMoisture: '65%',
      sunlight: '70%',
      airQuality: '85%',
      temperature: '20°C',
      recommendations: [
        'Increase sunlight exposure slightly',
        'Ensure soil remains well-drained',
        'Watch for signs of mildew',
      ],
    },
  },
  '3': {
    id: '3',
    date: new Date('2024-02-18'),
    cropType: 'Corn',
    healthScore: 92,
    imageUrl: 'https://images.unsplash.com/photo-1601472122408-78885d2ca00b?q=80&w=800&auto=format&fit=crop',
    details: {
      soilMoisture: '80%',
      sunlight: '95%',
      airQuality: '88%',
      temperature: '27°C',
      recommendations: [
        'Maintain high sunlight exposure',
        'Check for nutrient deficiencies',
        'Prepare for possible harvest window',
      ],
    },
  },
};


export default function ScanDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const scan = mockData[id as keyof typeof mockData];

  if (!scan) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Scan not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Image source={{ uri: scan.imageUrl }} style={styles.image} />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{scan.cropType}</Text>
        <View style={styles.scoreContainer}>
          <View style={[styles.scoreBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.scoreText}>{scan.healthScore}%</Text>
          </View>
          <Text style={styles.scoreLabel}>Health Score</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Droplets size={24} color={colors.accent} />
            <Text style={styles.metricValue}>{scan.details.soilMoisture}</Text>
            <Text style={styles.metricLabel}>Moisture</Text>
          </View>
          <View style={styles.metricCard}>
            <Sun size={24} color={colors.accent} />
            <Text style={styles.metricValue}>{scan.details.sunlight}</Text>
            <Text style={styles.metricLabel}>Sunlight</Text>
          </View>
          <View style={styles.metricCard}>
            <Wind size={24} color={colors.accent} />
            <Text style={styles.metricValue}>{scan.details.airQuality}</Text>
            <Text style={styles.metricLabel}>Air Quality</Text>
          </View>
          <View style={styles.metricCard}>
            <Leaf size={24} color={colors.accent} />
            <Text style={styles.metricValue}>{scan.details.temperature}</Text>
            <Text style={styles.metricLabel}>Temperature</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {scan.details.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={styles.recommendationBullet} />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>
      </View>
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
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.xl * 2,
    right: spacing.md,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: spacing.sm,
    ...shadows.small,
  },
  image: {
    width: '100%',
    height: 300,
  },
  detailsContainer: {
    padding: spacing.lg,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  scoreBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  scoreText: {
    ...typography.caption,
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
  },
  scoreLabel: {
    ...typography.caption,
    color: colors.text,
    opacity: 0.7,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    width: '47%',
    ...shadows.small,
  },
  metricValue: {
    ...typography.subheading,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.text,
    opacity: 0.7,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  recommendationBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
  },
  recommendationText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});