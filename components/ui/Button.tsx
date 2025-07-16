import React from "react";
import { Pressable, PressableProps, Text } from "react-native";

interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  const baseStyle = "px-4 py-3 rounded-xl";
  const variantStyle = variant === "primary" ? "bg-[#FFC400]" : "border border-gray-300";
  const disabledStyle = disabled ? "opacity-50" : "";
  const textStyle = variant === "primary" ? "text-[#212121]" : "text-[#212121]";

  return (
    <Pressable
      className={`${baseStyle} ${variantStyle} ${disabledStyle}`}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : 'ボタン')}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || false }}
      disabled={disabled}
      {...props}
    >
      <Text className={`text-center font-semibold text-sm ${textStyle}`}>{children}</Text>
    </Pressable>
  );
};
