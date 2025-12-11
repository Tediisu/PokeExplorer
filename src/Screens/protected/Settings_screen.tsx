import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';

const SettingsScreen: React.FC = () => {
  const [musicVolume, setMusicVolume] = useState(0.4);
  const [soundVolume, setSoundVolume] = useState(0.4);
  const [vibrationsOn, setVibrationsOn] = useState(true);
  const [hapticsOn, setHapticsOn] = useState(true);

  // Replace with real slider if you use @react-native-community/slider
  const FakeSlider: React.FC<{ value: number }> = ({ value }) => {
    const percentage = `${Math.round(value * 100)}%`;
    return (
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderFill, { width: percentage }]} />
      </View>
    );
  };

  const renderRow = (title: string, rightText?: string, danger?: boolean) => (
    <View style={styles.row}>
      <Text style={[styles.rowText, danger && styles.rowDanger]}>{title}</Text>
      {rightText ? (
        <Text style={styles.rowRightText}>{rightText}</Text>
      ) : (
        <Text style={styles.chevron}>{'›'}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <Text style={styles.title}>SETTINGS</Text>

        {/* Top controls */}
        <View style={styles.topCard}>
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Music</Text>
            <FakeSlider value={musicVolume} />
          </View>

          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Sound</Text>
            <FakeSlider value={soundVolume} />
          </View>

          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Vibrations</Text>
            <Switch
              value={vibrationsOn}
              onValueChange={setVibrationsOn}
              trackColor={{ false: '#ccc', true: '#4caf50' }}
            />
          </View>

          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Haptics</Text>
            <Switch
              value={hapticsOn}
              onValueChange={setHapticsOn}
              trackColor={{ false: '#ccc', true: '#4caf50' }}
            />
          </View>
        </View>

        {/* List sections */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section 1 */}
          <View style={styles.section}>
            {renderRow('Account')}
            {renderRow('General')}
            {renderRow('Notifications')}
          </View>

          {/* Section 2 */}
          <View style={styles.section}>
            {renderRow('AR')}
            {renderRow('Uploads')}
            {renderRow('Connected Devices and Services')}
            {renderRow('Accessibility')}
            {renderRow('Advanced Settings')}
          </View>

          {/* Section 3 */}
          <View style={styles.section}>
            {renderRow('About')}
            <View style={styles.row}>
              <Text style={styles.rowText}>Game Version</Text>
              <Text style={styles.rowRightText}>1.0.0</Text>
            </View>
          </View>

          {/* Section 4 */}
          <View style={styles.section}>
            {renderRow('Sign Out', undefined, true)}
          </View>
        </ScrollView>

        {/* Bottom floating button */}
        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.8}
            onPress={() => {
              // close / navigate back
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
    backgroundColor: '#C4FFC4', // light green background
  },
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  topCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  controlLabel: {
    flex: 1,
    fontSize: 16,
    color: '#111',
  },
  sliderTrack: {
    width: 150,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // space for bottom button
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    color: '#111',
  },
  rowRightText: {
    fontSize: 14,
    color: '#888',
  },
  rowDanger: {
    color: '#E53935',
  },
  chevron: {
    fontSize: 20,
    color: '#999',
  },
  bottomArea: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00B8CC',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabIcon: {
    fontSize: 28,
    color: 'white',
    marginTop: -2,
  },
});

export default SettingsScreen;
