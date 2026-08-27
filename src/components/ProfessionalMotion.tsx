import React from 'react';
import { MotiView } from 'moti';

export const FadeInView = ({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) => (
  <MotiView
    from={{ opacity: 0, translateY: 10 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'timing', duration: 400, delay }}
    style={style}
  >
    {children}
  </MotiView>
);
