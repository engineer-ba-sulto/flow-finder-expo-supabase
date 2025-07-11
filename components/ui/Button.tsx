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
  const baseStyle = "px-4 py-2 rounded-lg";
  const variantStyle = variant === "primary" ? "bg-[#FFC400]" : "bg-[#212121]";
  const disabledStyle = disabled ? "opacity-50" : "";
  const textStyle = variant === "primary" ? "text-black" : "text-white";

  return (
    <Pressable
      className={`${baseStyle} ${variantStyle} ${disabledStyle}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || false }}
      disabled={disabled}
      {...props}
    >
      <Text className={`text-center font-medium ${textStyle}`}>{children}</Text>
    </Pressable>
  );
};
