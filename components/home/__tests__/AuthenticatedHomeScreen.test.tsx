import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import AuthenticatedHomeScreen from '../AuthenticatedHomeScreen';

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

describe('AuthenticatedHomeScreen', () => {
  const defaultProps = {
    goalData: { count: 3, loading: false, error: null },
    refreshing: false,
    onRefresh: jest.fn(),
    fetchGoalCount: jest.fn(),
    router: mockRouter,
    user: { id: '1', email: 'test@example.com' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本表示', () => {
    it('ウェルカムメッセージが表示される', () => {
      render(<AuthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByText('Flow Finderへようこそ')).toBeTruthy();
      expect(screen.getByText('おかえりなさい')).toBeTruthy();
    });

    it('アプリ説明が表示される', () => {
      render(<AuthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByText('あなたの成長を妨げる「見えない壁」を見つけ、壊すためのパーソナルコーチング アプリ')).toBeTruthy();
    });

    it('進捗セクションが表示される', () => {
      render(<AuthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByText('あなたの進捗')).toBeTruthy();
    });

    it('クイックアクションセクションが表示される', () => {
      render(<AuthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByText('クイックアクション')).toBeTruthy();
      expect(screen.getByText('ゴールを確認')).toBeTruthy();
      expect(screen.getByText('新しいゴールを追加')).toBeTruthy();
    });
  });

  describe('ゴール数表示', () => {
    it('ゴール数が正常に表示される', () => {
      render(<AuthenticatedHomeScreen {...defaultProps} />);
      
      expect(screen.getByText('3')).toBeTruthy();
      expect(screen.getByText('登録ゴール')).toBeTruthy();
    });

    it('ローディング中は「...」と「読み込み中」が表示される', () => {
      const loadingProps = {
        ...defaultProps,
        goalData: { count: 0, loading: true, error: null },
      };
      
      render(<AuthenticatedHomeScreen {...loadingProps} />);
      
      expect(screen.getByText('...')).toBeTruthy();
      expect(screen.getByText('読み込み中')).toBeTruthy();
    });

    it('エラー時はエラーメッセージと再取得ボタンが表示される', () => {
      const errorProps = {
        ...defaultProps,
        goalData: { count: 0, loading: false, error: 'ゴール数の取得に失敗しました' },
      };
      
      render(<AuthenticatedHomeScreen {...errorProps} />);
      
      expect(screen.getByText('ゴール数の取得に失敗しました')).toBeTruthy();
      expect(screen.getByText('再取得')).toBeTruthy();
    });

    it('再取得ボタンをタップするとfetchGoalCountが呼ばれる', () => {
      const errorProps = {
        ...defaultProps,
        goalData: { count: 0, loading: false, error: 'ゴール数の取得に失敗しました' },
      };
      
      render(<AuthenticatedHomeScreen {...errorProps} />);
      
      const retryButton = screen.getByText('再取得');
      fireEvent.press(retryButton);
      
      expect(defaultProps.fetchGoalCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('ナビゲーション', () => {
    it('「ゴールを確認」ボタンをタップするとゴール画面に遷移する', () => {
      render(<AuthenticatedHomeScreen {...defaultProps} />);
      
      const viewGoalsButton = screen.getByText('ゴールを確認');
      fireEvent.press(viewGoalsButton);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/(tabs)/goals');
    });

    it('「新しいゴールを追加」ボタンをタップするとゴール画面に遷移する', () => {
      render(<AuthenticatedHomeScreen {...defaultProps} />);
      
      const addGoalButton = screen.getByText('新しいゴールを追加');
      fireEvent.press(addGoalButton);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/(tabs)/goals');
    });
  });

  describe('プル更新', () => {
    it('refreshing=trueの時、RefreshControlが有効になる', () => {
      const refreshingProps = {
        ...defaultProps,
        refreshing: true,
      };
      
      const { toJSON } = render(<AuthenticatedHomeScreen {...refreshingProps} />);
      
      // RefreshControlのrefreshing プロパティが true になることを確認
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なアクセシビリティラベルが設定されている', () => {
      render(<AuthenticatedHomeScreen {...defaultProps} />);
      
      // アクセシビリティラベルが存在することを確認
      expect(screen.getByLabelText('ホーム画面')).toBeTruthy();
      expect(screen.getByLabelText('Flow Finderへようこそ')).toBeTruthy();
      expect(screen.getByLabelText('おかえりなさい')).toBeTruthy();
    });
  });
});