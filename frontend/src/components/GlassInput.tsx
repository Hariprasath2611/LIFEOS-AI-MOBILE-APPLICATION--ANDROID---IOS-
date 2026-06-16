import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';

interface GlassInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  label,
  error,
  containerClassName = '',
  className = '',
  ...props
}) => {
  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && <Text className="text-mutedText text-sm mb-1.5 font-medium">{label}</Text>}
      <View
        className={`bg-card rounded-xl border ${
          error ? 'border-red-500' : 'border-glassBorder'
        } px-4 py-3`}
        style={{ backgroundColor: '#111111' }}
      >
        <TextInput
          className={`text-white text-base p-0 ${className}`}
          placeholderTextColor="#A0A0A0"
          {...props}
        />
      </View>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};
