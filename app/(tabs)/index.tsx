import { StyleSheet, Button, View, Pressable  } from 'react-native';
import { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {useWithSound} from './useWithSound';

export default function HomeScreen() {
  const [timer, setTimer] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [audioContext, setAudioContext] = useState(null);
  const [oscillator, setOscillator] = useState(null);

  useEffect(() => {
    let interval = null;
    if (isTracking) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 100);
      }, 100);
    } else if (!isTracking && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTracking, timer]);

  const handlePressOut = () => {
    setIsTracking(false);
    const newMessage = timer >= 100 ? "-" : "."; 
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setTimer(0);
    stopSound();
  };

  const handleReset = () => {
    setMessages([]);
  };

  const playFrequency = (frequency) => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    setAudioContext(ctx);
    setOscillator(osc);
  };

  const stopSound = () => {
    if (oscillator) {
      oscillator.stop();
      setOscillator(null);
    }
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
  };

  const handlePressIn = () => {
    setTimer(0);
    setIsTracking(true);
    playFrequency(440);
  };

  const handleBackspace = () => {
    setMessages(prevMessages => prevMessages.slice(0, -1));
  };

  const handleSpace = () => {
    setMessages(prevMessages => [...prevMessages, "/"]);
  };

  return (
    <ThemedView>
        <View className="Intro">
            <ThemedText type="title" style={styles.title}>Welcome!</ThemedText>
            <ThemedText>This is a morse code transmitter</ThemedText>
        </View>
        <View style={styles.messageContainer} className="Messages">
          {messages.map((msg, index) => (
            <ThemedText key={index} style={styles.message}>{msg}</ThemedText>
          ))}
        </View>
        <View style={styles.stepContainer} className='Buttons'>
          <View style={styles.buttonContainer}>
            <Pressable 
              style={styles.button}
              onPressIn={handlePressIn} 
              onPressOut={handlePressOut}
            >
              <button style={styles.PressButton}>Press</button>
            </Pressable>
          </View>
          <View style={styles.rowContainer}>
            <Pressable 
              style={styles.spaceButton}
              onPress={handleSpace}
            >
              <button style={styles.SpaceButton}>Space</button>
            </Pressable>
            <Pressable 
              style={styles.backspaceButton}
              onPress={handleBackspace}
            >
              <button style={styles.BackspaceButton}>Backspace</button>
            </Pressable>
            <Pressable 
              style={styles.resetButton}
              onPress={handleReset}
            >
              <button style={styles.ResetButton}>Reset</button>
            </Pressable>
          </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title:{
    marginTop: 10,
  },
  stepContainer: {
    marginTop: 100, 
  },
  messageContainer: {
    flexDirection: 'row', // Arrange messages in a row
    flexWrap: 'wrap', // Allow messages to wrap to the next line
    marginTop: 10, // Add some space above the messages
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  message: {
    marginRight: 5, // Add some space between messages
    marginBottom: 5, // Add some space below messages
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Space out buttons evenly
    marginTop: 20, // Add some space above the buttons
    width: '100%', // Ensure the button container takes full width
  },
  button: {
    flex: 1, // Allow the press button to take equal space
    margin: 5, // Add some margin between buttons
  },
  resetButton: {
    flex: 1, // Allow the reset button to take equal space
    margin: 5, // Add some margin between buttons
  },
  ResetButton: {
    height: 100, // Increase height
    backgroundColor: '#FF4136', // Red color for the reset button
    borderRadius: 10, // Rounded corners
    justifyContent: 'center', // Center the text vertically
  },
  PressButton: {
    height: 100, // Increase height
    backgroundColor: '#007BFF', // Blue color for the press button
    borderRadius: 10, // Rounded corners
    justifyContent: 'center', // Center the text vertically
  },
  backspaceButton: {
    flex: 1, // Allow the backspace button to take equal space
    margin: 5, // Add some margin between buttons
  },
  BackspaceButton: {
    height: 100, // Increase height
    backgroundColor: '#FF851B', // Orange color for the backspace button
    borderRadius: 10, // Rounded corners
    justifyContent: 'center', // Center the text vertically
  },
  spaceButton: {
    flex: 1, // Allow the space button to take equal space
    margin: 5, // Add some margin between buttons
  },
  SpaceButton: {
    height: 100, // Increase height
    backgroundColor: '#7FDBFF', // Light blue color for the space button
    borderRadius: 10, // Rounded corners
    justifyContent: 'center', // Center the text vertically
  },
  rowContainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Space out buttons evenly
    marginTop: 20, // Add some space above the buttons
    width: '100%', // Ensure the row container takes full width
  },
});
