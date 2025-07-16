import React from 'react';
import { View, Text, Pressable, PressableProps, ViewProps } from 'react-native';

interface CardProps extends PressableProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'default' | 'primary' | 'error';
  padding?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  variant = 'default',
  padding = 'medium',
  disabled = false,
  onPress,
  ...props
}) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'primary':
        return 'border-[#FFC400]';
      case 'error':
        return 'border-[#F44336]';
      default:
        return 'border-gray-200';
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'small':
        return 'p-2';
      case 'large':
        return 'p-6';
      default:
        return 'p-4';
    }
  };

  const borderColor = getBorderColor();
  const paddingClass = getPadding();
  const disabledStyle = disabled ? 'opacity-50' : '';
  const baseStyle = `bg-white rounded-xl shadow border ${borderColor} ${paddingClass} ${disabledStyle}`;

  if (onPress) {
    return (
      <Pressable
        className={baseStyle}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        {...props}
      >
        {title && (
          <Text className="text-lg font-semibold mb-2 text-gray-800">
            {title}
          </Text>
        )}
        {children}
      </Pressable>
    );
  }

  return (
    <View className={baseStyle}>
      {title && (
        <Text className="text-lg font-semibold mb-2 text-gray-800">
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};