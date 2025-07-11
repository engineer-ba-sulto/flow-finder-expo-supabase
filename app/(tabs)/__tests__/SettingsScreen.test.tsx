import { render } from "@testing-library/react-native";
import SettingsTab from "../settings";

describe("<SettingsTab />", () => {
  test("設定画面のテキストが正しくレンダリングされること", () => {
    const { getByText } = render(<SettingsTab />);

    // 設定画面に表示されるテキストを検証
    expect(getByText("Settings")).toBeTruthy();
  });

  test("スタイルが正しく適用されていること", () => {
    const { toJSON } = render(<SettingsTab />);

    // レンダリングされたコンポーネントのJSON構造を取得
    const tree = toJSON();

    // ルート要素（View）のスタイルを確認
    expect(tree.props.style).toEqual({
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    });

    // 個別のスタイルプロパティを確認
    expect(tree.props.style.flex).toBe(1);
    expect(tree.props.style.justifyContent).toBe("center");
    expect(tree.props.style.alignItems).toBe("center");
  });
});
