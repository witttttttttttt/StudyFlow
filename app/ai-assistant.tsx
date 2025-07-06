// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const { currentTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your AI study assistant. I can help you with homework, answer questions, and provide explanations. You can also upload images of your homework for detailed help!',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      image: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(userMessage),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: Message): string => {
    if (userMessage.image) {
      return 'I can see the homework image you\'ve uploaded! Based on what I can analyze:\n\n• This appears to be a math/science problem\n• Let me break down the solution step by step\n• First, identify the key variables and given information\n• Then apply the relevant formulas or concepts\n• Finally, solve systematically\n\nWould you like me to explain any specific part in more detail?';
    }

    const responses = [
      'Great question! Let me help you understand this concept step by step.',
      'I\'d be happy to explain that for you. Here\'s a clear breakdown of the topic.',
      'That\'s an interesting problem! Let\'s work through it together.',
      'I can definitely help with that. Here\'s what you need to know.',
      'Let me provide a detailed explanation to help you grasp this concept.',
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Image',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        {/* Header */}
        <LinearGradient
          colors={currentTheme.colors.gradient}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Study Assistant</Text>
          <View style={styles.headerRight} />
        </LinearGradient>

        {/* Messages */}
        <ScrollView 
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  {
                    backgroundColor: message.isUser 
                      ? currentTheme.colors.primary 
                      : currentTheme.colors.surface,
                  }
                ]}
              >
                {message.image && (
                  <Image
                    source={{ uri: message.image }}
                    style={styles.messageImage}
                    contentFit="cover"
                  />
                )}
                <Text
                  style={[
                    styles.messageText,
                    {
                      color: message.isUser 
                        ? 'white' 
                        : currentTheme.colors.text,
                    }
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    {
                      color: message.isUser 
                        ? 'rgba(255,255,255,0.7)' 
                        : currentTheme.colors.textSecondary,
                    }
                  ]}
                >
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
            </View>
          ))}
          
          {isLoading && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={[styles.messageBubble, { backgroundColor: currentTheme.colors.surface }]}>
                <Text style={[styles.messageText, { color: currentTheme.colors.textSecondary }]}>
                  AI is thinking...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Image Preview */}
        {selectedImage && (
          <View style={[styles.imagePreview, { backgroundColor: currentTheme.colors.surface }]}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
              contentFit="cover"
            />
            <TouchableOpacity
              style={styles.removeImage}
              onPress={() => setSelectedImage(null)}
            >
              <MaterialIcons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Area */}
        <View style={[styles.inputContainer, { backgroundColor: currentTheme.colors.surface }]}>
          <TouchableOpacity
            style={[styles.imageButton, { borderColor: currentTheme.colors.primary }]}
            onPress={showImageOptions}
          >
            <MaterialIcons name="photo-camera" size={24} color={currentTheme.colors.primary} />
          </TouchableOpacity>
          
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: currentTheme.colors.background,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border,
              }
            ]}
            placeholder="Ask me anything about your homework..."
            placeholderTextColor={currentTheme.colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: (inputText.trim() || selectedImage) 
                  ? currentTheme.colors.primary 
                  : currentTheme.colors.textSecondary,
              }
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() && !selectedImage}
          >
            <MaterialIcons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 24,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, y: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    textAlign: 'right',
  },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  removeImage: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    gap: 12,
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});