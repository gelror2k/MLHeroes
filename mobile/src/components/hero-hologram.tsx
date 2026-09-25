import { useEffect, useState } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  G,
  Image as SvgImage,
  LinearGradient,
  Mask,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { monogram } from '@/components/hero-portrait';
import { ThemedText } from '@/components/themed-text';
import { roleColor } from '@/constants/roleColors';
import { Fonts, Palette } from '@/constants/theme';
import { usePortraits } from '@/hooks/use-portraits';
import type { Hero } from '@/types/hero';

/**
 * The hero profile's stage, styled after a broadcast AR hologram: the hero in
 * full colour, edges dissolving into the dark, standing inside a glowing ring
 * platform. Drag sideways and the hero slides across the platform and turns in
 * 3D; let go and it springs back.
 *
 * It is the portrait art, not a 3D model: nobody publishes MLBB hero models or
 * full-body cutouts (checked Moonton's GMS API and the fandom wiki, 2026-09-25).
 * The soft edges come from an SVG mask, which works on iOS, Android and web.
 */

export const STAGE_HEIGHT = 440;
const FIG_W = 236;
const FIG_H = 384; // wiki portraits are 240x390
const FIG_TOP = 10;
const RING_CY = 374;
const RING_RX = 148;
const RING_RY = 32;
const MAX_SHIFT = 70; // keeps the hero on the platform
const GLOW = Palette.accent;

/** Drag distance -> on-screen shift, with resistance past MAX_SHIFT. */
function rubberBand(dx: number): number {
  const abs = Math.abs(dx);
  return abs <= MAX_SHIFT ? dx : Math.sign(dx) * (MAX_SHIFT + (abs - MAX_SHIFT) * 0.2);
}

/** Disc and light column: everything behind the hero except the rim. */
function PlatformBack({ width }: { width: number }) {
  const cx = width / 2;
  const column = `${cx - RING_RX + 18},${RING_CY} ${cx + RING_RX - 18},${RING_CY} ${cx + RING_RX - 40},${FIG_TOP + 40} ${cx - RING_RX + 40},${FIG_TOP + 40}`;
  return (
    <Svg width={width} height={STAGE_HEIGHT} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id="stageColumn" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor={GLOW} stopOpacity={0.14} />
          <Stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </LinearGradient>
        <RadialGradient id="stageDisc" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={GLOW} stopOpacity={0.18} />
          <Stop offset="0.75" stopColor={Palette.backgroundBar} stopOpacity={1} />
          <Stop offset="1" stopColor={Palette.backgroundBar} stopOpacity={1} />
        </RadialGradient>
      </Defs>
      <Polygon points={column} fill="url(#stageColumn)" />
      <Ellipse cx={cx} cy={RING_CY} rx={RING_RX} ry={RING_RY} fill="url(#stageDisc)" />
      <Ellipse
        cx={cx}
        cy={RING_CY}
        rx={RING_RX - 26}
        ry={RING_RY - 6}
        fill="none"
        stroke={GLOW}
        strokeOpacity={0.25}
        strokeWidth={1}
      />
    </Svg>
  );
}

/** The glowing rim. Its back half sits behind the hero, the front half in front. */
function Rim({ width, half }: { width: number; half: 'back' | 'front' }) {
  const cx = width / 2;
  // SVG y points down: sweep 1 from left to right goes over the top (back), 0 under the bottom (front).
  const d = `M ${cx - RING_RX} ${RING_CY} A ${RING_RX} ${RING_RY} 0 0 ${half === 'back' ? 1 : 0} ${cx + RING_RX} ${RING_CY}`;
  return (
    <Svg width={width} height={STAGE_HEIGHT} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Path d={d} fill="none" stroke={GLOW} strokeOpacity={0.18} strokeWidth={14} strokeLinecap="round" />
      <Path d={d} fill="none" stroke={GLOW} strokeOpacity={0.35} strokeWidth={6} strokeLinecap="round" />
      <Path d={d} fill="none" stroke={GLOW} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

/**
 * The hero: portrait (device photo first, then the `picture` link) behind a soft
 * mask that dissolves the sides and lets the bottom melt into the platform. The
 * monogram underneath shows through only when there is no image or it fails to
 * load, because the portrait art is opaque where the mask is.
 */
function Figure({ hero }: { hero: Hero }) {
  const { portraitFor } = usePortraits();
  const uri = portraitFor(hero.hero_id) ?? hero.picture;
  return (
    <Svg width={FIG_W} height={FIG_H}>
      <Defs>
        <LinearGradient id="figureFadeX" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
          <Stop offset="0.24" stopColor="#FFFFFF" stopOpacity={1} />
          <Stop offset="0.76" stopColor="#FFFFFF" stopOpacity={1} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id="figureFadeY" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
          <Stop offset="0.07" stopColor="#FFFFFF" stopOpacity={1} />
          <Stop offset="0.55" stopColor="#FFFFFF" stopOpacity={1} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </LinearGradient>
        <Mask id="figureMaskX">
          <Rect width={FIG_W} height={FIG_H} fill="url(#figureFadeX)" />
        </Mask>
        <Mask id="figureMaskY">
          <Rect width={FIG_W} height={FIG_H} fill="url(#figureFadeY)" />
        </Mask>
      </Defs>
      <SvgText
        x={FIG_W / 2}
        y={FIG_H * 0.5}
        textAnchor="middle"
        fontFamily={Fonts.display}
        fontSize={72}
        fill={roleColor(hero.roles[0] ?? '')}
        fillOpacity={0.8}>
        {monogram(hero.name)}
      </SvgText>
      {uri ? (
        // Two masks multiplied: soft sides from one, a short top fade and a long bottom fade from the other.
        <G mask="url(#figureMaskY)">
          <SvgImage
            href={{ uri }}
            width={FIG_W}
            height={FIG_H}
            preserveAspectRatio="xMidYMin slice"
            mask="url(#figureMaskX)"
          />
        </G>
      ) : null}
    </Svg>
  );
}

export function HeroHologram({ hero, width }: { hero: Hero; width: number }) {
  const [shift] = useState(() => new Animated.Value(0));
  const [bob] = useState(() => new Animated.Value(0));
  const [pulse] = useState(() => new Animated.Value(0));
  const [touched, setTouched] = useState(false);

  const [pan] = useState(() => {
    const settle = () => Animated.spring(shift, { toValue: 0, friction: 5, tension: 60, useNativeDriver: true }).start();
    return PanResponder.create({
      // Only claim clearly horizontal drags, so vertical scrolling still reaches the ScrollView.
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2,
      onPanResponderGrant: () => {
        shift.stopAnimation();
        setTouched(true);
      },
      onPanResponderMove: (_, g) => shift.setValue(rubberBand(g.dx)),
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: settle,
      onPanResponderTerminate: settle,
    });
  });

  useEffect(() => {
    const loops = [
      Animated.loop(
        Animated.sequence([
          Animated.timing(bob, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(bob, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0, duration: 1600, useNativeDriver: true }),
        ]),
      ),
    ];
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [bob, pulse]);

  const rotateY = shift.interpolate({ inputRange: [-MAX_SHIFT, 0, MAX_SHIFT], outputRange: ['-35deg', '0deg', '35deg'] });
  const floatY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  const rimOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] });

  return (
    <View
      style={[styles.stage, { width }]}
      accessible
      accessibilityLabel={`${hero.name} on the hero stage`}
      accessibilityHint="Drag sideways to move and turn the hero"
      {...pan.panHandlers}>
      <PlatformBack width={width} />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: rimOpacity }]}>
        <Rim width={width} half="back" />
      </Animated.View>

      <Animated.View
        style={[
          styles.figure,
          { left: (width - FIG_W) / 2 },
          { transform: [{ perspective: 800 }, { translateX: shift }, { translateY: floatY }, { rotateY }] },
        ]}>
        <Figure hero={hero} />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, { opacity: rimOpacity }]}>
        <Rim width={width} half="front" />
      </Animated.View>

      {!touched ? (
        <ThemedText type="micro" themeColor="textMuted" style={styles.hint}>
          Drag to turn
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    height: STAGE_HEIGHT,
    overflow: 'hidden',
  },
  figure: {
    position: 'absolute',
    top: FIG_TOP,
    width: FIG_W,
    height: FIG_H,
  },
  hint: {
    position: 'absolute',
    bottom: 6,
    alignSelf: 'center',
  },
});
