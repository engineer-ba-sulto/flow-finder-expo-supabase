import React, { useState } from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Goal, CreateGoalInput, GoalPriority } from "../../types/goal.types";

interface GoalFormProps {
  onSubmit: (goal: CreateGoalInput) => void;
  onCancel: () => void;
  initialGoal?: Goal;
  isSubmitting?: boolean;
}

export const GoalForm: React.FC<GoalFormProps> = ({
  onSubmit,
  onCancel,
  initialGoal,
  isSubmitting = false
}) => {
  const [title, setTitle] = useState(initialGoal?.title || "");
  const [description, setDescription] = useState(initialGoal?.description || "");
  const [priority, setPriority] = useState<GoalPriority>(
    initialGoal?.priority || GoalPriority.MEDIUM
  );
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = "タイトルは必須です";
    } else if (title.length > 200) {
      newErrors.title = "タイトルは200文字以内で入力してください";
    }

    if (description && description.length > 1000) {
      newErrors.description = "説明は1000文字以内で入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || isSubmitting) {
      return;
    }

    const goalData: CreateGoalInput = {
      title: title.trim(),
      description: description?.trim() || undefined,
      priority,
      user_id: "mock-user-id"
    };

    onSubmit(goalData);
  };

  return (
    <View 
      testID="goal-form-container"
      className="bg-white p-6 rounded-lg"
    >
      <Input
        label="ゴールタイトル"
        placeholder="ゴールのタイトルを入力"
        value={title}
        onChangeText={setTitle}
        error={!!errors.title}
        errorMessage={errors.title}
        disabled={isSubmitting}
        accessibilityLabel="ゴールタイトル"
      />

      <Input
        label="ゴール説明"
        placeholder="ゴールの詳細説明（任意）"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        error={!!errors.description}
        errorMessage={errors.description}
        disabled={isSubmitting}
        accessibilityLabel="ゴール説明"
      />

      <View className="mb-4">
        <Text className="text-sm font-medium mb-2 text-gray-700">
          優先度
        </Text>
        <View className="border-2 border-[#FFC400] rounded-lg bg-white">
          <Picker
            testID="priority-picker"
            selectedValue={priority}
            onValueChange={(value: GoalPriority) => setPriority(value)}
            enabled={!isSubmitting}
          >
            <Picker.Item 
              label="低優先度" 
              value={GoalPriority.LOW} 
            />
            <Picker.Item 
              label="中優先度" 
              value={GoalPriority.MEDIUM} 
            />
            <Picker.Item 
              label="高優先度" 
              value={GoalPriority.HIGH} 
            />
            <Picker.Item 
              label="緊急" 
              value={GoalPriority.URGENT} 
            />
            <Picker.Item 
              label="最重要" 
              value={GoalPriority.CRITICAL} 
            />
          </Picker>
        </View>
      </View>

      <View className="flex-row gap-4 mt-6">
        <View className="flex-1">
          <Button
            variant="primary"
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </View>
        <View className="flex-1">
          <Button
            variant="secondary"
            onPress={onCancel}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
        </View>
      </View>
    </View>
  );
};