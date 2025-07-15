import { renderHook, act } from "@testing-library/react-native";
import { useGoalCompletion } from "../useGoalCompletion";
import { Goal } from "../../types/goal.types";

// expo-routerのモック
const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    push: mockPush,
    back: mockBack,
  },
}));

const mockGoalData: Goal = {
  id: "mock-goal-id",
  title: "英語学習マスター",
  description: "TOEIC900点を目指す",
  priority: 2,
  status: "active",
  created_at: new Date("2024-01-01T00:00:00.000Z"),
  updated_at: new Date("2024-01-01T00:00:00.000Z"),
  user_id: "mock-user-id",
};

describe("useGoalCompletion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 現在日時を固定（2024-01-31と仮定）
    const mockDate = new Date("2024-01-31T12:00:00.000Z");
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    // @ts-ignore
    Date.now = jest.fn(() => mockDate.getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("初期状態が正しく設定されること", () => {
    const { result } = renderHook(() => useGoalCompletion(mockGoalData));

    expect(result.current.reflection).toBe("");
    expect(result.current.duration).toBe(31); // 1月1日から1月31日まで31日間
    expect(result.current.startDate).toBe("2024/1/1");
    expect(result.current.completionDate).toBe("2024/1/31");
  });

  test("振り返りテキストが更新できること", () => {
    const { result } = renderHook(() => useGoalCompletion(mockGoalData));

    act(() => {
      result.current.setReflection("英語学習を通じて継続の大切さを学びました");
    });

    expect(result.current.reflection).toBe("英語学習を通じて継続の大切さを学びました");
  });

  test("期間計算が正しく動作すること", () => {
    // 1週間後のゴールの場合
    const recentGoal: Goal = {
      ...mockGoalData,
      created_at: new Date("2024-01-24T00:00:00.000Z"),
    };

    const { result } = renderHook(() => useGoalCompletion(recentGoal));

    expect(result.current.duration).toBe(8); // 1月24日から1月31日まで8日間
  });

  test("handleShareAchievementが呼び出されること", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    const { result } = renderHook(() => useGoalCompletion(mockGoalData));

    act(() => {
      result.current.handleShareAchievement();
    });

    expect(consoleSpy).toHaveBeenCalledWith("成果をシェア");
    consoleSpy.mockRestore();
  });

  test("handleNextGoalがゴール作成画面に遷移すること", () => {
    const { result } = renderHook(() => useGoalCompletion(mockGoalData));

    act(() => {
      result.current.handleNextGoal();
    });

    expect(mockPush).toHaveBeenCalledWith("/modal/create-goal");
  });

  test("handleLaterがモーダルを閉じること", () => {
    const { result } = renderHook(() => useGoalCompletion(mockGoalData));

    act(() => {
      result.current.handleLater();
    });

    expect(mockBack).toHaveBeenCalled();
  });

  test("日付フォーマットが日本語形式で正しく表示されること", () => {
    const goalWithDifferentDate: Goal = {
      ...mockGoalData,
      created_at: new Date("2023-12-25T00:00:00.000Z"),
    };

    const { result } = renderHook(() => useGoalCompletion(goalWithDifferentDate));

    expect(result.current.startDate).toBe("2023/12/25");
    expect(result.current.completionDate).toBe("2024/1/31");
  });

  test("同一日の場合期間が1日となること", () => {
    const todayGoal: Goal = {
      ...mockGoalData,
      created_at: new Date("2024-01-31T00:00:00.000Z"),
    };

    const { result } = renderHook(() => useGoalCompletion(todayGoal));

    expect(result.current.duration).toBe(1); // 同一日の場合は1日
  });
});