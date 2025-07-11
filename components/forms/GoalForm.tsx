import { Picker } from "@react-native-picker/picker";
import React, { useCallback, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { CreateGoalInput, Goal, GoalPriority } from "../../types/goal.types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

/**
 * ゴール作成・編集フォームのプロパティ
 */
interface GoalFormProps {
  /** ゴール送信時のコールバック関数 */
  onSubmit: (goal: CreateGoalInput) => void;
  /** キャンセル時のコールバック関数 */
  onCancel: () => void;
  /** 編集時の初期ゴールデータ（新規作成時は undefined） */
  initialGoal?: Goal;
  /** 送信中状態フラグ */
  isSubmitting?: boolean;
}

/**
 * バリデーションエラーの型定義
 */
interface ValidationErrors {
  title?: string;
  description?: string;
}

/**
 * フォームの定数値
 */
const FORM_CONSTRAINTS = {
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const;

/**
 * 優先度選択肢のデータ
 */
const PRIORITY_OPTIONS = [
  { label: "低優先度", value: GoalPriority.LOW },
  { label: "中優先度", value: GoalPriority.MEDIUM },
  { label: "高優先度", value: GoalPriority.HIGH },
  { label: "緊急", value: GoalPriority.URGENT },
  { label: "最重要", value: GoalPriority.CRITICAL },
] as const;

/**
 * ゴール作成・編集フォームコンポーネント
 *
 * Flow Finderアプリケーションでゴールの作成および編集を行うフォームです。
 * バリデーション機能、アクセシビリティ対応、パフォーマンス最適化を含みます。
 *
 * @param props - GoalFormProps
 * @returns React.JSX.Element
 */
export const GoalForm: React.FC<GoalFormProps> = React.memo(
  ({ onSubmit, onCancel, initialGoal, isSubmitting = false }) => {
    // フォーム状態の管理
    const [title, setTitle] = useState<string>(initialGoal?.title || "");
    const [description, setDescription] = useState<string>(
      initialGoal?.description || ""
    );
    const [priority, setPriority] = useState<GoalPriority>(
      initialGoal?.priority || GoalPriority.MEDIUM
    );
    const [errors, setErrors] = useState<ValidationErrors>({});

    /**
     * フォームのバリデーションを実行
     * @returns バリデーション成功の場合 true
     */
    const validateForm = useCallback((): boolean => {
      const newErrors: ValidationErrors = {};

      // タイトルのバリデーション
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        newErrors.title = "タイトルは必須です";
      } else if (trimmedTitle.length > FORM_CONSTRAINTS.TITLE_MAX_LENGTH) {
        newErrors.title = `タイトルは${FORM_CONSTRAINTS.TITLE_MAX_LENGTH}文字以内で入力してください`;
      }

      // 説明のバリデーション
      if (
        description &&
        description.length > FORM_CONSTRAINTS.DESCRIPTION_MAX_LENGTH
      ) {
        newErrors.description = `説明は${FORM_CONSTRAINTS.DESCRIPTION_MAX_LENGTH}文字以内で入力してください`;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [title, description]);

    /**
     * フォーム送信処理
     */
    const handleSubmit = useCallback(() => {
      if (!validateForm() || isSubmitting) {
        return;
      }

      try {
        const goalData: CreateGoalInput = {
          title: title.trim(),
          description: description?.trim() || undefined,
          priority,
          user_id: "mock-user-id", // TODO: 実際のユーザーIDに置き換え
        };

        onSubmit(goalData);
      } catch (error) {
        console.error("ゴール送信エラー:", error);
        // エラーハンドリングは親コンポーネントで行う
      }
    }, [title, description, priority, validateForm, isSubmitting, onSubmit]);

    /**
     * 優先度変更ハンドラー
     */
    const handlePriorityChange = useCallback((value: GoalPriority) => {
      setPriority(value);
    }, []);

    /**
     * 優先度選択肢のレンダリング
     */
    const priorityItems = useMemo(() => {
      return PRIORITY_OPTIONS.map(({ label, value }) => (
        <Picker.Item key={value} label={label} value={value} />
      ));
    }, []);

    return (
      <View
        testID="goal-form-container"
        className="bg-white p-6 rounded-lg shadow-lg"
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
          accessibilityHint="ゴールのタイトルを入力してください。必須項目です。"
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
          accessibilityHint="ゴールの詳細説明を入力してください。任意項目です。"
        />

        <View className="mb-4">
          <Text className="text-sm font-medium mb-2 text-gray-700">優先度</Text>
          <View className="border-2 border-[#FFC400] rounded-lg bg-white">
            <Picker
              testID="priority-picker"
              selectedValue={priority}
              onValueChange={handlePriorityChange}
              enabled={!isSubmitting}
              accessibilityLabel="優先度選択"
              accessibilityHint="ゴールの優先度を選択してください"
            >
              {priorityItems}
            </Picker>
          </View>
        </View>

        <View className="flex-row gap-4 mt-6">
          <View className="flex-1">
            <Button
              variant="primary"
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityLabel={isSubmitting ? "保存中" : "保存"}
              accessibilityHint="ゴールを保存します"
            >
              {isSubmitting ? "保存中..." : "保存"}
            </Button>
          </View>
          <View className="flex-1">
            <Button
              variant="secondary"
              onPress={onCancel}
              disabled={isSubmitting}
              accessibilityLabel="キャンセル"
              accessibilityHint="ゴールの作成・編集をキャンセルします"
            >
              キャンセル
            </Button>
          </View>
        </View>
      </View>
    );
  }
);
