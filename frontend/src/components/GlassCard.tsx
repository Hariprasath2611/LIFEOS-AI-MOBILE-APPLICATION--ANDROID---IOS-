import React from 'react';
import { View, ViewProps } from 'react-native';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', style, ...props }) => {
  return (
    <View
      className={`bg-card rounded-2xl border border-glassBorder p-4 shadow-2xl ${className}`}
      style={[
        {
          backgroundColor: '#111111',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 5,
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
