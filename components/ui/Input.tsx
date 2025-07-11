import React from 'react';
import { TextInput, TextInputProps, Text, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error = false,
  errorMessage,
  disabled = false,
  editable = true,
  ...props
}) => {
  const borderColor = error ? 'border-red-500' : 'border-[#FFC400]';
  const disabledStyle = disabled ? 'opacity-50 bg-gray-100' : 'bg-white';
  const baseStyle = `border-2 rounded-lg px-4 py-2 ${borderColor} ${disabledStyle}`;
  
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium mb-2 text-gray-700">
          {label}
        </Text>
      )}
      <TextInput
        className={baseStyle}
        editable={disabled ? false : editable}
        accessibilityState={{ disabled }}
        {...props}
      />
      {error && errorMessage && (
        <Text className="text-red-500 text-sm mt-1">
          {errorMessage}
        </Text>
      )}
    </View>
  );
};