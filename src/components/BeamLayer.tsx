import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import type { BeamEdge } from '../game/types';

export interface BeamLayerProps {
  edges: BeamEdge[];
  cols: number;
  tile: number;
  frame: number;
  width: number;
  height: number;
  beam: string;
  under: string;
  beaconId: number;
  pulseKey: number;
  reducedMotion: boolean;
}

/** The lit route, drawn as one SVG overlay on top of the tiles. */
export function BeamLayer(props: BeamLayerProps) {
  const {
    edges,
    cols,
    tile,
    frame,
    width,
    height,
    beam,
    under,
    beaconId,
    pulseKey,
    reducedMotion,
  } = props;

  const sweep = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reducedMotion) {
      sweep.setValue(1);
      return;
    }
    sweep.setValue(0.25);
    const anim = Animated.timing(sweep, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [pulseKey, reducedMotion, sweep]);

  const center = (id: number) => ({
    x: frame + (id % cols) * tile + tile / 2,
    y: frame + Math.floor(id / cols) * tile + tile / 2,
  });

  const beacon = center(beaconId);

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, { opacity: sweep }]}>
      <Svg width={width} height={height}>
        {edges.map((edge, i) => {
          const a = center(edge.a);
          const b = center(edge.b);
          return (
            <Line
              key={'u' + i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={under}
              strokeOpacity={0.35}
              strokeWidth={10}
              strokeLinecap="round"
            />
          );
        })}
        {edges.map((edge, i) => {
          const a = center(edge.a);
          const b = center(edge.b);
          return (
            <Line
              key={'b' + i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={beam}
              strokeWidth={5}
              strokeLinecap="round"
            />
          );
        })}
        <Circle cx={beacon.x} cy={beacon.y} r={tile * 0.42} fill={beam} fillOpacity={0.12} />
      </Svg>
    </Animated.View>
  );
}
