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
  const borderColor = error ? 'border-[#F44336]' : 'border-gray-300';
  const disabledStyle = disabled ? 'opacity-50 bg-gray-100' : 'bg-white';
  const baseStyle = `border rounded-xl px-4 py-3 ${borderColor} ${disabledStyle}`;
  
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
        accessibilityRole="text"
        accessibilityLabel={label || props.placeholder || '入力欄'}
        accessibilityHint={error ? `エラー: ${errorMessage}` : undefined}
        accessibilityState={{ disabled }}
        {...props}
      />
      {error && errorMessage && (
        <Text 
          className="text-[#F44336] text-sm mt-1"
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
};