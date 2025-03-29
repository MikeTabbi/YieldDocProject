import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { format } from 'date-fns';
import { Search, Filter, ChevronRight } from 'lucide-react-native';
import { colors, typography, spacing, shadows } from '@/constants/theme';
import { useRouter } from 'expo-router';

type ScanRecord = {
  id: string;
  date: Date;
  cropType: string;
  healthScore: number;
  imageUrl: string;
};

const mockData: ScanRecord[] = [
  {
    id: '1',
    date: new Date('2024-02-20'),
    cropType: 'Tomatoes',
    healthScore: 95,
    imageUrl: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '2',
    date: new Date('2024-02-19'),
    cropType: 'Lettuce',
    healthScore: 88,
    imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '3',
    date: new Date('2024-02-18'),
    cropType: 'Corn',
    healthScore: 92,
    imageUrl: 'https://images.unsplash.com/photo-1601472122408-78885d2ca00b?q=80&w=400&auto=format&fit=crop',
  },
];

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#FFC107';
    return '#F44336';
  };

  const renderItem = ({ item }: { item: ScanRecord }) => (
    <TouchableOpacity 
      style={styles.scanItem}
      onPress={() => router.push(`/records/${item.id}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.scanImage} />
      <View style={styles.scanInfo}>
        <Text style={styles.cropType}>{item.cropType}</Text>
        <Text style={styles.scanDate}>{format(item.date, 'MMM d, yyyy')}</Text>
        <View style={styles.healthScoreContainer}>
          <View
            style={[
              styles.healthScoreBadge,
              { backgroundColor: getHealthScoreColor(item.healthScore) },
            ]}>
            <Text style={styles.healthScoreText}>{item.healthScore}%</Text>
          </View>
          <Text style={styles.healthLabel}>Health Score</Text>
        </View>
      </View>
      <ChevronRight size={24} color={colors.text} style={{ opacity: 0.3 }} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text} style={{ opacity: 0.5 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search crops..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="rgba(0,0,0,0.5)"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={mockData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
    backgroundColor: 'white',
    ...shadows.small,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
  filterButton: {
    padding: spacing.xs,
  },
  list: {
    padding: spacing.md,
    gap: spacing.md,
  },
  scanItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.small,
  },
  scanImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  scanInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  cropType: {
    ...typography.subheading,
    color: colors.text,
  },
  scanDate: {
    ...typography.caption,
    color: colors.text,
    opacity: 0.7,
    marginBottom: spacing.xs,
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  healthScoreBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  healthScoreText: {
    ...typography.caption,
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  healthLabel: {
    ...typography.caption,
    color: colors.text,
    opacity: 0.7,
  },
});