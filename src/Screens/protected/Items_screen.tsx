import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';

type Item = {
  id: string;
  name: string;
  description: string;
  category: string; // e.g. "MEDICINE", "POKE BALLS"
};

const DATA: Item[] = [
  {
    id: '1',
    name: 'Max Potion',
    description:
      'Medicine that completely restores an HP of a single Pokémon.',
    category: 'MEDICINE',
  },
  {
    id: '2',
    name: 'Revive',
    description:
      'Medicine that can revive a fainted Pokémon. Restores half of the fainted Pokémon’s maximum HP.',
    category: 'MEDICINE',
  },
  {
    id: '3',
    name: 'Poke Ball',
    description:
      'A device for catching wild Pokémon. It is thrown like a ball, and will encapsulate the target.',
    category: 'POKE BALLS',
  },
];

const ItemsScreen: React.FC = () => {
  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemRow}>
      {/* Left icon circle */}
      <View style={styles.itemIcon} />

      {/* Middle text */}
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>

      {/* Right delete icon (placeholder) */}
      <TouchableOpacity style={styles.trashButton}>
        <Text style={styles.trashText}>🗑</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ITEMS</Text>
          <Text style={styles.headerSubtitle}>10 / 99</Text>
        </View>
        <View style={styles.headerDivider} />
        <View style={styles.headerCategoryBar}>
          <Text style={styles.headerCategoryText}>MEDICINE</Text>
        </View>

        {/* List */}
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Bottom floating button */}
        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.8}
            onPress={() => {
              // close / back
            }}
          >
            <Text style={styles.fabIcon}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  root: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#1E88E5',
    margin: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  header: {
    paddingTop: 8,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E88E5',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#1E88E5',
    marginTop: 2,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#1E88E5',
    marginTop: 4,
  },
  headerCategoryBar: {
    paddingVertical: 4,
    alignItems: 'center',
  },
  headerCategoryText: {
    fontSize: 12,
    color: '#1E88E5',
    letterSpacing: 1,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    paddingBottom: 80,
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#000',
    marginRight: 8,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  itemDescription: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  itemCategory: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  trashButton: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trashText: {
    fontSize: 18,
    color: '#B0BEC5',
  },
  bottomArea: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00B8CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 26,
    color: '#FFFFFF',
    marginTop: -2,
  },
});

export default ItemsScreen;
