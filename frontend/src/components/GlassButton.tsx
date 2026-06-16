import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface GlassButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  textClassName?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  variant = 'primary',
  isLoading = false,
  className = '',
  textClassName = '',
  disabled,
  ...props
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary border border-primary';
      case 'secondary':
        return 'bg-secondary border border-secondary';
      case 'outline':
        return 'bg-transparent border border-primary';
      default:
        return 'bg-primary';
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return 'text-primary font-semibold';
      case 'primary':
      case 'secondary':
        return 'text-background font-bold';
      default:
        return 'text-background';
    }
  };

  return (
    <TouchableOpacity
      className={`py-3 px-6 rounded-xl flex-row justify-center items-center active:opacity-80 ${getContainerStyle()} ${className}`}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#00FF88' : '#0A0A0A'} size="small" />
      ) : (
        <Text className={`text-base text-center ${getTextStyle()} ${textClassName}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
