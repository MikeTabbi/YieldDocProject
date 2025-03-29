import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing } from '@/constants/theme';

export default function TypingIndicator() {
  const animations = [
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ];

  useEffect(() => {
    const animate = (index: number) => {
      return Animated.sequence([
        Animated.timing(animations[index], {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(animations[index], {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]);
    };

    const sequence = Animated.stagger(200, [
      animate(0),
      animate(1),
      animate(2),
    ]);

    const loop = Animated.loop(sequence);
    loop.start();

    return () => {
      loop.stop();
      animations.forEach(anim => anim.setValue(0));
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.dotsContainer}>
          {animations.map((animation, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  transform: [
                    {
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -8],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignItems: 'flex-start',
  },
  bubble: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    padding: spacing.md,
    maxWidth: '80%',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text,
    opacity: 0.5,
  },
});