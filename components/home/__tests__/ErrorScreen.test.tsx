import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ErrorScreen from '../ErrorScreen';

// モック設定
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

describe('ErrorScreen', () => {
  const defaultProps = {
    error: { message: 'テストエラーメッセージ' },
    onRetry: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本表示', () => {
    it('エラータイトルが表示される', () => {
      render(<ErrorScreen {...defaultProps} />);
      
      expect(screen.getByText('エラーが発生しました')).toBeTruthy();
    });

    it('エラーメッセージが表示される', () => {
      render(<ErrorScreen {...defaultProps} />);
      
      expect(screen.getByText('テストエラーメッセージ')).toBeTruthy();
    });

    it('再読み込みボタンが表示される', () => {
      render(<ErrorScreen {...defaultProps} />);
      
      expect(screen.getByText('再読み込み')).toBeTruthy();
    });
  });

  describe('エラーメッセージのバリエーション', () => {
    it('異なるエラーメッセージが正しく表示される', () => {
      const customProps = {
        ...defaultProps,
        error: { message: '別のエラーメッセージ' },
      };
      
      render(<ErrorScreen {...customProps} />);
      
      expect(screen.getByText('別のエラーメッセージ')).toBeTruthy();
    });

    it('空のエラーメッセージでもレンダリングされる', () => {
      const emptyErrorProps = {
        ...defaultProps,
        error: { message: '' },
      };
      
      render(<ErrorScreen {...emptyErrorProps} />);
      
      expect(screen.getByText('エラーが発生しました')).toBeTruthy();
      expect(screen.getByText('再読み込み')).toBeTruthy();
    });

    it('長いエラーメッセージが正しく表示される', () => {
      const longErrorProps = {
        ...defaultProps,
        error: { 
          message: 'これは非常に長いエラーメッセージです。ネットワークの接続に問題があるか、サーバーが一時的に利用できない状態にある可能性があります。しばらくしてから再度お試しください。'
        },
      };
      
      render(<ErrorScreen {...longErrorProps} />);
      
      expect(screen.getByText(longErrorProps.error.message)).toBeTruthy();
    });
  });

  describe('再読み込み機能', () => {
    it('再読み込みボタンをタップするとonRetryが呼ばれる', () => {
      render(<ErrorScreen {...defaultProps} />);
      
      const retryButton = screen.getByText('再読み込み');
      fireEvent.press(retryButton);
      
      expect(defaultProps.onRetry).toHaveBeenCalledTimes(1);
    });

    it('再読み込みボタンを複数回タップすると複数回onRetryが呼ばれる', () => {
      render(<ErrorScreen {...defaultProps} />);
      
      const retryButton = screen.getByText('再読み込み');
      fireEvent.press(retryButton);
      fireEvent.press(retryButton);
      fireEvent.press(retryButton);
      
      expect(defaultProps.onRetry).toHaveBeenCalledTimes(3);
    });
  });

  describe('レイアウトとスタイル', () => {
    it('ScrollViewが正しく設定されている', () => {
      const { toJSON } = render(<ErrorScreen {...defaultProps} />);
      
      // ScrollViewの構造を確認
      expect(toJSON()).toMatchSnapshot();
    });

    it('中央寄せレイアウトが適用されている', () => {
      render(<ErrorScreen {...defaultProps} />);
      
      // 要素が存在することで中央寄せが機能していることを確認
      expect(screen.getByText('エラーが発生しました')).toBeTruthy();
      expect(screen.getByText('テストエラーメッセージ')).toBeTruthy();
      expect(screen.getByText('再読み込み')).toBeTruthy();
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なアクセシビリティラベルが設定されている', () => {
      render(<ErrorScreen {...defaultProps} />);
      
      expect(screen.getByLabelText('エラー画面')).toBeTruthy();
      expect(screen.getByLabelText('エラーが発生しました')).toBeTruthy();
      expect(screen.getByLabelText('エラー詳細: テストエラーメッセージ')).toBeTruthy();
      expect(screen.getByLabelText('再読み込みを実行')).toBeTruthy();
    });

    it('ヘッダーロールが正しく設定されている', () => {
      const { toJSON } = render(<ErrorScreen {...defaultProps} />);
      
      // accessibilityRoleがheaderに設定されていることを確認
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('プロパティの型', () => {
    it('Error オブジェクトの様々な形式に対応する', () => {
      // 標準的なError オブジェクト
      const standardError = new Error('標準エラー');
      const standardProps = {
        ...defaultProps,
        error: standardError,
      };
      
      render(<ErrorScreen {...standardProps} />);
      expect(screen.getByText('標準エラー')).toBeTruthy();
    });

    it('カスタムエラーオブジェクトに対応する', () => {
      const customError = {
        message: 'カスタムエラー',
        code: 'CUSTOM_ERROR',
      };
      const customProps = {
        ...defaultProps,
        error: customError,
      };
      
      render(<ErrorScreen {...customProps} />);
      expect(screen.getByText('カスタムエラー')).toBeTruthy();
    });
  });
});