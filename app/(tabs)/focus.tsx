// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  Slider,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface TimerSession {
  workTime: number;
  breakTime: number;
  longBreakTime: number;
  cycles: number;
}

export default function FocusTimer() {
  const { currentTheme } = useTheme();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<'work' | 'break' | 'longBreak'>('work');
  const [completedCycles, setCompletedCycles] = useState(0);
  const [isMediaPlaying, setIsMediaPlaying] = useState(false);
  const [currentMediaId, setCurrentMediaId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [userMedia, setUserMedia] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  
  const [timerSettings, setTimerSettings] = useState<TimerSession>({
    workTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    cycles: 4,
  });

interface MediaFile {
  id: string;
  name: string;
  uri: string;
  type: 'audio' | 'video';
  duration?: number;
}

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (currentSession === 'work') {
      const newCompletedCycles = completedCycles + 1;
      setCompletedCycles(newCompletedCycles);
      
      if (newCompletedCycles % timerSettings.cycles === 0) {
        setCurrentSession('longBreak');
        setTimeLeft(timerSettings.longBreakTime * 60);
      } else {
        setCurrentSession('break');
        setTimeLeft(timerSettings.breakTime * 60);
      }
    } else {
      setCurrentSession('work');
      setTimeLeft(timerSettings.workTime * 60);
    }
    
    Alert.alert(
      'Session Complete!',
      `Time for a ${currentSession === 'work' ? 'break' : 'work session'}!`,
      [{ text: 'OK' }]
    );
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentSession('work');
    setTimeLeft(timerSettings.workTime * 60);
    setCompletedCycles(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    loadUserMedia();
    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, []);

  const loadUserMedia = async () => {
    try {
      const saved = await AsyncStorage.getItem('userMedia');
      if (saved) {
        setUserMedia(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading user media:', error);
    }
  };

  const saveUserMedia = async (media: MediaFile[]) => {
    try {
      await AsyncStorage.setItem('userMedia', JSON.stringify(media));
    } catch (error) {
      console.error('Error saving user media:', error);
    }
  };

  const handleMediaPress = async (media: MediaFile) => {
    try {
      if (currentMediaId === media.id && isMediaPlaying) {
        await stopMedia();
        return;
      }

      setIsLoading(true);
      await stopMedia();

      if (media.type === 'audio') {
        const { sound } = await Audio.Sound.createAsync(
          { uri: media.uri },
          { 
            shouldPlay: true, 
            isLooping: true,
            volume: volume,
          }
        );
        
        setCurrentSound(sound);
        setIsMediaPlaying(true);
        setCurrentMediaId(media.id);
      }
      
    } catch (error) {
      console.error('Error playing media:', error);
      Alert.alert('Error', 'Failed to play media file');
    } finally {
      setIsLoading(false);
    }
  };

  const stopMedia = async () => {
    try {
      if (currentSound) {
        await currentSound.unloadAsync();
        setCurrentSound(null);
      }
      setIsMediaPlaying(false);
      setCurrentMediaId(null);
    } catch (error) {
      console.error('Error stopping media:', error);
    }
  };

  const handleAddMedia = async () => {
    Alert.alert(
      'Add Media',
      'Choose the type of media to upload',
      [
        { text: 'Audio', onPress: () => uploadMedia('audio') },
        { text: 'Video', onPress: () => uploadMedia('video') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const uploadMedia = async (type: 'audio' | 'video') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: type === 'audio' ? 'audio/*' : 'video/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const newMedia: MediaFile = {
          id: Date.now().toString(),
          name: result.assets[0].name?.replace(/\.[^/.]+$/, "") || `Custom ${type}`,
          uri: result.assets[0].uri,
          type: type,
        };
        
        const updatedMedia = [...userMedia, newMedia];
        setUserMedia(updatedMedia);
        await saveUserMedia(updatedMedia);
        Alert.alert('Success', `${type} file added successfully!`);
      }
    } catch (error) {
      console.error('Error adding media:', error);
      Alert.alert('Error', 'Failed to add media file');
    }
  };

  const handleRemoveMedia = async (mediaId: string) => {
    Alert.alert(
      'Remove Media',
      'Are you sure you want to remove this media file?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            if (currentMediaId === mediaId) {
              await stopMedia();
            }
            const updatedMedia = userMedia.filter(m => m.id !== mediaId);
            setUserMedia(updatedMedia);
            await saveUserMedia(updatedMedia);
          }
        },
      ]
    );
  };

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work':
        return currentTheme.colors.timerGradient;
      case 'break':
        return ['#A8E6CF', '#88D8A3'];
      case 'longBreak':
        return ['#FFB366', '#FF8E6B'];
      default:
        return currentTheme.colors.timerGradient;
    }
  };

  const getSessionTitle = () => {
    switch (currentSession) {
      case 'work':
        return 'FOCUS TIME';
      case 'break':
        return 'SHORT BREAK';
      case 'longBreak':
        return 'LONG BREAK';
      default:
        return 'FOCUS TIME';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <LinearGradient
            colors={getSessionColor()}
            style={styles.timerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.sessionTitle}>{getSessionTitle()}</Text>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            
            <View style={styles.timerControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleTimer}
              >
                <MaterialIcons
                  name={isRunning ? 'pause' : 'play-arrow'}
                  size={32}
                  color="white"
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={resetTimer}
              >
                <MaterialIcons name="stop" size={32} color="white" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.cycleText}>
              Cycle {completedCycles + 1} of {timerSettings.cycles}
            </Text>
          </LinearGradient>
        </View>

        {/* Session Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            TIMER SETTINGS
          </Text>
          <View style={[styles.card, { backgroundColor: currentTheme.colors.surface }]}>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>
                Work Time
              </Text>
              <View style={styles.settingControls}>
                <TouchableOpacity
                  style={[styles.settingButton, { borderColor: currentTheme.colors.primary }]}
                  onPress={() => setTimerSettings({
                    ...timerSettings,
                    workTime: Math.max(1, timerSettings.workTime - 5)
                  })}
                >
                  <MaterialIcons name="remove" size={20} color={currentTheme.colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.settingValue, { color: currentTheme.colors.text }]}>
                  {timerSettings.workTime}m
                </Text>
                <TouchableOpacity
                  style={[styles.settingButton, { borderColor: currentTheme.colors.primary }]}
                  onPress={() => setTimerSettings({
                    ...timerSettings,
                    workTime: timerSettings.workTime + 5
                  })}
                >
                  <MaterialIcons name="add" size={20} color={currentTheme.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>
                Break Time
              </Text>
              <View style={styles.settingControls}>
                <TouchableOpacity
                  style={[styles.settingButton, { borderColor: currentTheme.colors.primary }]}
                  onPress={() => setTimerSettings({
                    ...timerSettings,
                    breakTime: Math.max(1, timerSettings.breakTime - 1)
                  })}
                >
                  <MaterialIcons name="remove" size={20} color={currentTheme.colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.settingValue, { color: currentTheme.colors.text }]}>
                  {timerSettings.breakTime}m
                </Text>
                <TouchableOpacity
                  style={[styles.settingButton, { borderColor: currentTheme.colors.primary }]}
                  onPress={() => setTimerSettings({
                    ...timerSettings,
                    breakTime: timerSettings.breakTime + 1
                  })}
                >
                  <MaterialIcons name="add" size={20} color={currentTheme.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Media Player */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
              MEDIA PLAYER
            </Text>
            <View style={styles.soundControls}>
              {isMediaPlaying && (
                <TouchableOpacity 
                  onPress={stopMedia}
                  style={[styles.controlIconButton, { backgroundColor: currentTheme.colors.primary }]}
                >
                  <MaterialIcons name="stop" size={20} color="white" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleAddMedia}>
                <MaterialIcons name="add" size={24} color={currentTheme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Volume Control */}
          {isMediaPlaying && (
            <View style={[styles.volumeContainer, { backgroundColor: currentTheme.colors.surface }]}>
              <MaterialIcons name="volume-down" size={20} color={currentTheme.colors.textSecondary} />
              <Slider
                style={styles.volumeSlider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={async (newVolume) => {
                  setVolume(newVolume);
                  if (currentSound) {
                    await currentSound.setVolumeAsync(newVolume);
                  }
                }}
                minimumTrackTintColor={currentTheme.colors.primary}
                maximumTrackTintColor={currentTheme.colors.border}
                thumbStyle={{ backgroundColor: currentTheme.colors.primary }}
              />
              <MaterialIcons name="volume-up" size={20} color={currentTheme.colors.textSecondary} />
              <Text style={[styles.volumeText, { color: currentTheme.colors.textSecondary }]}>
                {Math.round(volume * 100)}%
              </Text>
            </View>
          )}
          
          {userMedia.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: currentTheme.colors.surface }]}>
              <MaterialIcons name="library-music" size={48} color={currentTheme.colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: currentTheme.colors.textSecondary }]}>
                No media files yet
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: currentTheme.colors.textSecondary }]}>
                Tap the + button to add audio or video files
              </Text>
            </View>
          ) : (
            <View style={styles.mediaGrid}>
              {userMedia.map((media) => (
                <TouchableOpacity
                  key={media.id}
                  style={[
                    styles.mediaButton,
                    {
                      backgroundColor: currentMediaId === media.id 
                        ? currentTheme.colors.primary 
                        : currentTheme.colors.surface,
                    }
                  ]}
                  onPress={() => handleMediaPress(media)}
                  onLongPress={() => handleRemoveMedia(media.id)}
                >
                  {isLoading && currentMediaId === media.id ? (
                    <MaterialIcons name="hourglass-empty" size={24} color="white" />
                  ) : (
                    <>
                      <MaterialIcons 
                        name={media.type === 'audio' ? 'audiotrack' : 'videocam'} 
                        size={24} 
                        color={currentMediaId === media.id ? 'white' : currentTheme.colors.text}
                      />
                      <Text style={[
                        styles.mediaName,
                        {
                          color: currentMediaId === media.id 
                            ? 'white' 
                            : currentTheme.colors.text
                        }
                      ]}>
                        {media.name}
                      </Text>
                      <Text style={[
                        styles.mediaType,
                        {
                          color: currentMediaId === media.id 
                            ? 'rgba(255,255,255,0.7)' 
                            : currentTheme.colors.textSecondary
                        }
                      ]}>
                        {media.type.toUpperCase()}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <Text style={[styles.soundHint, { color: currentTheme.colors.textSecondary }]}>
            Long press media files to delete them
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timerContainer: {
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, y: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  timerGradient: {
    paddingVertical: 60,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  sessionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 20,
    opacity: 0.9,
  },
  timerText: {
    color: 'white',
    fontSize: 72,
    fontWeight: '300',
    letterSpacing: -2,
    marginBottom: 30,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cycleText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
    opacity: 0.7,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  soundControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  volumeSlider: {
    flex: 1,
    height: 20,
  },
  volumeText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 35,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, y: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mediaButton: {
    width: (width - 64) / 2,
    aspectRatio: 1.2,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, y: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 12,
  },
  mediaName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  mediaType: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  soundHint: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});