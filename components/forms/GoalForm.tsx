import React, { useCallback, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
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
  { label: "高", value: GoalPriority.HIGH },
  { label: "中", value: GoalPriority.MEDIUM },
  { label: "低", value: GoalPriority.LOW },
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

    return (
      <View className="bg-white flex-1">
        {/* ヘッダータイトル */}
        <View className="p-6 pb-0">
          <Text className="text-lg font-bold text-[#212121] text-center mb-4">
            {initialGoal ? "ゴール編集" : "新しいゴール"}
          </Text>
        </View>

        {/* フォームコンテンツ */}
        <View className="px-6 pb-6 gap-4">
          {/* タイトル入力 */}
          <View>
            <Input
              label="タイトル"
              placeholder="例: 英語学習マスター"
              value={title}
              onChangeText={setTitle}
              error={!!errors.title}
              errorMessage={errors.title}
              disabled={isSubmitting}
              accessibilityLabel="ゴールタイトル"
              accessibilityHint="ゴールのタイトルを入力してください。必須項目です。"
            />
          </View>

          {/* 説明入力 */}
          <View>
            <Text className="text-sm font-medium mb-1 text-[#212121]">
              説明（任意）
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 bg-white text-sm min-h-[64px]"
              placeholder="このゴールについて詳しく..."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSubmitting}
              accessibilityLabel="ゴール説明"
              accessibilityHint="ゴールの詳細説明を入力してください。任意項目です。"
              style={{
                fontFamily: "System",
              }}
            />
            {errors.description && (
              <Text className="text-[#F44336] text-sm mt-1">
                {errors.description}
              </Text>
            )}
          </View>

          {/* 優先度選択（ボタン形式） */}
          <View>
            <Text className="text-sm font-medium mb-2 text-[#212121]">
              優先度
            </Text>
            <View className="flex-row gap-2">
              {PRIORITY_OPTIONS.map(({ label, value }) => (
                <Pressable
                  key={value}
                  className={`flex-1 py-2 px-3 rounded-lg ${
                    priority === value ? "bg-[#FFC400]" : "bg-gray-200"
                  }`}
                  onPress={() => handlePriorityChange(value)}
                  disabled={isSubmitting}
                  accessibilityLabel={`優先度${label}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: priority === value }}
                >
                  <Text
                    className={`text-sm text-center font-medium text-[#212121]`}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* アクションボタン */}
        <View className="flex-row gap-3 px-6 pb-6 mt-auto">
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
          <View className="flex-1">
            <Button
              variant="primary"
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityLabel={isSubmitting ? "保存中" : "作成"}
              accessibilityHint="ゴールを保存します"
            >
              {isSubmitting ? "保存中..." : initialGoal ? "更新" : "作成"}
            </Button>
          </View>
        </View>
      </View>
    );
  }
);
