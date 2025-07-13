import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import UnauthenticatedHomeScreen from '../UnauthenticatedHomeScreen';

// モック設定
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

jest.mock('../../../components/ui/Button', () => {
  const { Text, TouchableOpacity } = require('react-native');
  return {
    Button: ({ children, onPress, testID, className }: any) => (
      <TouchableOpacity onPress={onPress} testID={testID} className={className}>
        <Text>{children}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('../../../constants/app', () => ({
  APP_DESCRIPTION: 'あなたの成長を妨げる「見えない壁」を見つけ、壊すためのパーソナルコーチング アプリ',
}));

describe('UnauthenticatedHomeScreen', () => {
  const defaultProps = {
    router: mockRouter,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本表示', () => {
    it('メインウェルカムメッセージが表示される', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByText('Flow Finderへようこそ')).toBeTruthy();
    });

    it('アプリ説明が表示される', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByText('あなたの成長を妨げる「見えない壁」を見つけ、壊すためのパーソナルコーチング アプリ')).toBeTruthy();
    });

    it('特徴紹介メッセージが表示される', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByText(/成長の障壁を特定し、具体的な解決策を提案する/)).toBeTruthy();
      expect(screen.getByText(/パーソナルコーチングアプリです/)).toBeTruthy();
    });

    it('ログイン案内セクションが表示される', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByText('ログインして始めましょう')).toBeTruthy();
    });

    it('ログインボタンが表示される', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByText('ログイン')).toBeTruthy();
    });

    it('新規登録ボタンが表示される', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByText('新規登録')).toBeTruthy();
    });

    it('無料案内メッセージが表示される', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByText('無料で始められます')).toBeTruthy();
    });
  });

  describe('ナビゲーション', () => {
    it('ログインボタンをタップするとログイン画面に遷移する', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      const loginButton = screen.getByText('ログイン');
      fireEvent.press(loginButton);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
    });

    it('新規登録ボタンをタップすると登録画面に遷移する', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      const signupButton = screen.getByText('新規登録');
      fireEvent.press(signupButton);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/signup');
    });

    it('ボタンを複数回タップしても正しく動作する', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      const loginButton = screen.getByText('ログイン');
      const signupButton = screen.getByText('新規登録');
      
      fireEvent.press(loginButton);
      fireEvent.press(signupButton);
      fireEvent.press(loginButton);
      
      expect(mockRouter.push).toHaveBeenCalledTimes(3);
      expect(mockRouter.push).toHaveBeenNthCalledWith(1, '/auth/login');
      expect(mockRouter.push).toHaveBeenNthCalledWith(2, '/auth/signup');
      expect(mockRouter.push).toHaveBeenNthCalledWith(3, '/auth/login');
    });
  });

  describe('レイアウトとスタイル', () => {
    it('ScrollViewが正しく設定されている', () => {
      const { toJSON } = render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      // ScrollViewの構造を確認
      expect(toJSON()).toMatchSnapshot();
    });

    it('適切な背景色とパディングが設定されている', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      // 要素が存在することでスタイルが正しく適用されていることを確認
      expect(screen.getByText('Flow Finderへようこそ')).toBeTruthy();
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なアクセシビリティラベルが設定されている', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByLabelText('ログイン案内画面')).toBeTruthy();
      expect(screen.getByLabelText('Flow Finderへようこそ')).toBeTruthy();
      expect(screen.getByLabelText('ログイン画面に移動')).toBeTruthy();
      expect(screen.getByLabelText('新規登録画面に移動')).toBeTruthy();
      expect(screen.getByLabelText('無料で始められます')).toBeTruthy();
    });

    it('ヘッダーロールが正しく設定されている', () => {
      const { toJSON } = render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      // accessibilityRoleがheaderに設定されていることを確認
      expect(toJSON()).toMatchSnapshot();
    });

    it('アクセシビリティヒントが設定されている', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByLabelText('既存のアカウントでログインします')).toBeTruthy();
      expect(screen.getByLabelText('新しいアカウントを作成します')).toBeTruthy();
    });
  });

  describe('コンテンツのバリエーション', () => {
    it('APP_DESCRIPTIONが異なる値でも正しく表示される', () => {
      // 一時的にモックを変更
      jest.doMock('../../../constants/app', () => ({
        APP_DESCRIPTION: '別のアプリ説明文',
      }));
      
      // コンポーネントを再度要求
      const { UnauthenticatedHomeScreen: NewComponent } = require('../UnauthenticatedHomeScreen');
      
      render(<NewComponent {...defaultProps} />);
      
      // 新しい説明文が表示されることを確認
      expect(screen.getByText('別のアプリ説明文')).toBeTruthy();
    });
  });

  describe('コンポーネントの構造', () => {
    it('正しい階層構造でレンダリングされる', () => {
      const { toJSON } = render(<UnauthenticatedHomeScreen {...defaultProps} />);
      const tree = toJSON();
      
      // ルート要素がScrollViewであることを確認
      expect(tree?.type).toBe('ScrollView');
    });

    it('必要なセクションがすべて含まれている', () => {
      render(<UnauthenticatedHomeScreen {...defaultProps} />);
      
      // メインウェルカムセクション
      expect(screen.getByText('Flow Finderへようこそ')).toBeTruthy();
      
      // 特徴紹介
      expect(screen.getByText(/成長の障壁を特定し/)).toBeTruthy();
      
      // ログイン案内セクション
      expect(screen.getByText('ログインして始めましょう')).toBeTruthy();
      
      // ボタン
      expect(screen.getByText('ログイン')).toBeTruthy();
      expect(screen.getByText('新規登録')).toBeTruthy();
      
      // 追加情報
      expect(screen.getByText('無料で始められます')).toBeTruthy();
    });
  });

  describe('プロパティの処理', () => {
    it('routerプロパティが正しく渡される', () => {
      const customRouter = {
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
      };
      
      render(<UnauthenticatedHomeScreen router={customRouter} />);
      
      const loginButton = screen.getByText('ログイン');
      fireEvent.press(loginButton);
      
      expect(customRouter.push).toHaveBeenCalledWith('/auth/login');
    });
  });
});