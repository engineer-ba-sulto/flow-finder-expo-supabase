import { render } from "@testing-library/react-native";
import Tab from "../index";

describe("<Tab />", () => {
  test("テキストが正しくレンダリングされること", () => {
    const { getByText } = render(<Tab />);

    // HomeScreenに表示されるテキストを検証
    expect(getByText("Home")).toBeTruthy();
  });

  test("背景色が正しく設定されていること", () => {
    const { toJSON } = render(<Tab />);

    // レンダリングされたコンポーネントのJSON構造を取得
    const tree = toJSON();

    // ルート要素（View）のスタイルを確認
    expect(tree.props.className).toBe(
      "bg-red-500 flex-1 justify-center items-center"
    );

    // 個別のクラスを確認
    expect(tree.props.className).toContain("bg-red-500");
    expect(tree.props.className).toContain("flex-1");
    expect(tree.props.className).toContain("justify-center");
    expect(tree.props.className).toContain("items-center");
  });
});
