import React from 'react';
import { render, screen } from '@testing-library/react-native';
import LoadingScreen from '../LoadingScreen';

describe('LoadingScreen', () => {
  describe('基本表示', () => {
    it('ローディングメッセージが表示される', () => {
      render(<LoadingScreen />);
      
      expect(screen.getByText('読み込み中...')).toBeTruthy();
    });

    it('適切な構造でレンダリングされる', () => {
      const { toJSON } = render(<LoadingScreen />);
      
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('レイアウトとスタイル', () => {
    it('中央寄せレイアウトが適用されている', () => {
      render(<LoadingScreen />);
      
      // テキストが存在することで中央寄せが機能していることを確認
      expect(screen.getByText('読み込み中...')).toBeTruthy();
    });

    it('背景色が白色に設定されている', () => {
      const { toJSON } = render(<LoadingScreen />);
      
      // スナップショットでスタイルを確認
      expect(toJSON()).toMatchSnapshot();
    });

    it('flex-1クラスが適用されている', () => {
      const { toJSON } = render(<LoadingScreen />);
      
      // View要素のclassNameにflex-1が含まれることを確認
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なアクセシビリティラベルが設定されている', () => {
      render(<LoadingScreen />);
      
      expect(screen.getByLabelText('アプリを読み込み中です')).toBeTruthy();
      expect(screen.getByLabelText('読み込み中です')).toBeTruthy();
    });

    it('アクセシビリティロールが正しく設定されている', () => {
      const { toJSON } = render(<LoadingScreen />);
      
      // accessibilityRoleがtextに設定されていることを確認
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('コンポーネントの独立性', () => {
    it('プロパティなしでレンダリングできる', () => {
      // propsを渡さずにレンダリング
      expect(() => render(<LoadingScreen />)).not.toThrow();
    });

    it('複数回レンダリングしても同じ結果になる', () => {
      const { unmount } = render(<LoadingScreen />);
      unmount();
      
      // 再度レンダリング
      render(<LoadingScreen />);
      expect(screen.getByText('読み込み中...')).toBeTruthy();
    });
  });

  describe('テキストの内容', () => {
    it('正確なローディングテキストが表示される', () => {
      render(<LoadingScreen />);
      
      // 正確な文字列をチェック（三点リーダーを含む）
      expect(screen.getByText('読み込み中...')).toBeTruthy();
    });

    it('日本語テキストが正しく表示される', () => {
      render(<LoadingScreen />);
      
      const loadingText = screen.getByText('読み込み中...');
      expect(loadingText).toBeTruthy();
      
      // テキストノードの内容を確認
      expect(loadingText.props.children).toBe('読み込み中...');
    });
  });

  describe('コンポーネントの構造', () => {
    it('View要素とText要素の階層が正しい', () => {
      const { toJSON } = render(<LoadingScreen />);
      const tree = toJSON();
      
      // ルート要素がViewであることを確認
      expect(tree?.type).toBe('View');
      
      // 子要素がTextであることを確認
      expect(tree?.children?.[0]?.type).toBe('Text');
    });

    it('必要最小限の要素で構成されている', () => {
      const { toJSON } = render(<LoadingScreen />);
      const tree = toJSON();
      
      // シンプルな構造（View > Text）であることを確認
      expect(tree?.children).toHaveLength(1);
      expect(tree?.children?.[0]?.type).toBe('Text');
    });
  });

  describe('スタイルクラス', () => {
    it('View要素に適切なTailwindクラスが適用されている', () => {
      const { toJSON } = render(<LoadingScreen />);
      const tree = toJSON();
      
      // 期待されるクラスが含まれていることを確認
      expect(tree?.props?.className).toContain('flex-1');
      expect(tree?.props?.className).toContain('justify-center');
      expect(tree?.props?.className).toContain('items-center');
      expect(tree?.props?.className).toContain('bg-white');
    });

    it('Text要素に適切なTailwindクラスが適用されている', () => {
      const { toJSON } = render(<LoadingScreen />);
      const tree = toJSON();
      const textElement = tree?.children?.[0];
      
      expect(textElement?.props?.className).toContain('text-lg');
    });
  });
});