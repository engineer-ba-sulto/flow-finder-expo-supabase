import React from "react";
import { Pressable, PressableProps, Text } from "react-native";

interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary" | "success";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  disabled = false,
  ...props
}) => {
  const baseStyle = "px-4 py-2 rounded-lg";
  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return "bg-[#FFC400]";
      case "secondary":
        return "bg-[#212121]";
      case "success":
        return "bg-[#4CAF50]";
      default:
        return "bg-[#FFC400]";
    }
  };
  const variantStyle = getVariantStyle();
  const disabledStyle = disabled ? "opacity-50" : "";
  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return "text-black";
      case "secondary":
        return "text-white";
      case "success":
        return "text-white";
      default:
        return "text-black";
    }
  };
  const textStyle = getTextStyle();

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
