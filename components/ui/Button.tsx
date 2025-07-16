import React from "react";
import { Pressable, PressableProps, Text } from "react-native";

interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  disabled = false,
  ...props
}) => {
  const baseStyle = "px-4 py-3 rounded-xl";
  const variantStyle = variant === "primary" ? "bg-[#FFC400]" : "bg-[#212121]";
  const disabledStyle = disabled ? "opacity-50" : "";
  const textStyle = variant === "primary" ? "text-[#212121]" : "text-white";

  return (
    <Pressable
      className={`${baseStyle} ${variantStyle} ${disabledStyle}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || false }}
      disabled={disabled}
      {...props}
    >
      <Text className={`text-center font-semibold text-sm ${textStyle}`}>{children}</Text>
    </Pressable>
  );
};
