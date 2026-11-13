import React from 'react';
import { ImageBackground, StyleSheet, View, useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { THEME } from '../constants/theme';
import { StarField } from './StarField';

export interface ScreenBackgroundProps {
  overlay: string[];
  drift?: boolean;
  stars?: boolean;
  blobs?: Array<{ color: string; size: number; top: number; left: number; opacity: number }>;
  children: React.ReactNode;
}

/**
 * bg_game is the ONLY background image in the app. Screens are told apart by
 * their gradient overlay (the loader runs at 0.9+ so it never reads as Menu).
 */
export function ScreenBackground({
  overlay,
  drift = true,
  stars = true,
  blobs,
  children,
}: ScreenBackgroundProps) {
  const { width, height } = useWindowDimensions();
  return (
    <ImageBackground source={assets.bgGame} style={styles.root} resizeMode="cover">
      <LinearGradient
        colors={overlay}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {blobs
        ? blobs.map((blob, i) => (
            <View
              key={i}
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: blob.top,
                left: blob.left,
                width: blob.size,
                height: blob.size,
                borderRadius: blob.size / 2,
                backgroundColor: blob.color,
                opacity: blob.opacity,
              }}
            />
          ))
        : null}
      {stars ? (
        <StarField width={width} height={height} drift={drift} color={THEME.colors.textPrimary} />
      ) : null}
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.colors.bg },
  content: { flex: 1 },
});
