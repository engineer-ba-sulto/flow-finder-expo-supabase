import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import HomeScreen from '../index';
import { useAuth } from '../../../hooks/useAuth';
import { useHomeData } from '../../../hooks/useHomeData';

// モック設定
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../hooks/useHomeData', () => ({
  useHomeData: jest.fn(),
}));

jest.mock('../../../components/home/AuthenticatedHomeScreen', () => {
  return function MockAuthenticatedHomeScreen() {
    return (
      <View testID="authenticated-home-screen">
        <Text>Authenticated Home Screen</Text>
      </View>
    );
  };
});

jest.mock('../../../components/home/UnauthenticatedHomeScreen', () => {
  return function MockUnauthenticatedHomeScreen() {
    return (
      <View testID="unauthenticated-home-screen">
        <Text>Unauthenticated Home Screen</Text>
      </View>
    );
  };
});

jest.mock('../../../components/home/LoadingScreen', () => {
  return function MockLoadingScreen() {
    return (
      <View testID="loading-screen">
        <Text>Loading Screen</Text>
      </View>
    );
  };
});

jest.mock('../../../components/home/ErrorScreen', () => {
  return function MockErrorScreen() {
    return (
      <View testID="error-screen">
        <Text>Error Screen</Text>
      </View>
    );
  };
});

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(),
  navigate: jest.fn(),
  dismiss: jest.fn(),
  dismissTo: jest.fn(),
  canDismiss: jest.fn(),
} as any;

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseHomeData = useHomeData as jest.MockedFunction<typeof useHomeData>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
  });

  describe('ローディング状態', () => {
    it('loading=trueの時、LoadingScreenを表示する', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        error: null,
        isAuthenticated: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
      });
      mockUseHomeData.mockReturnValue({
        goalData: { count: 0, loading: false, error: null },
        refreshing: false,
        onRefresh: jest.fn(),
        fetchGoalCount: jest.fn(),
      });

      render(<HomeScreen />);
      
      // LoadingScreenコンポーネントがレンダリングされることを確認
      expect(screen.getByTestId('loading-screen')).toBeTruthy();
      expect(screen.getByText('Loading Screen')).toBeTruthy();
    });
  });

  describe('エラー状態', () => {
    it('error存在時、ErrorScreenを表示する', () => {
      const testError = new Error('テストエラー');
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        error: testError,
        isAuthenticated: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
      });
      mockUseHomeData.mockReturnValue({
        goalData: { count: 0, loading: false, error: null },
        refreshing: false,
        onRefresh: jest.fn(),
        fetchGoalCount: jest.fn(),
      });

      render(<HomeScreen />);
      
      // ErrorScreenコンポーネントがレンダリングされることを確認
      expect(screen.getByTestId('error-screen')).toBeTruthy();
      expect(screen.getByText('Error Screen')).toBeTruthy();
    });
  });

  describe('認証済み状態', () => {
    it('認証済み且つユーザー存在時、AuthenticatedHomeScreenを表示する', () => {
      const testUser = { 
        id: '1', 
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01T00:00:00.000Z'
      } as any;
      mockUseAuth.mockReturnValue({
        user: testUser,
        loading: false,
        error: null,
        isAuthenticated: true,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
      });
      mockUseHomeData.mockReturnValue({
        goalData: { count: 3, loading: false, error: null },
        refreshing: false,
        onRefresh: jest.fn(),
        fetchGoalCount: jest.fn(),
      });

      render(<HomeScreen />);
      
      // AuthenticatedHomeScreenコンポーネントがレンダリングされることを確認
      expect(screen.getByTestId('authenticated-home-screen')).toBeTruthy();
      expect(screen.getByText('Authenticated Home Screen')).toBeTruthy();
    });
  });

  describe('未認証状態', () => {
    it('未認証時、UnauthenticatedHomeScreenを表示する', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
      });
      mockUseHomeData.mockReturnValue({
        goalData: { count: 0, loading: false, error: null },
        refreshing: false,
        onRefresh: jest.fn(),
        fetchGoalCount: jest.fn(),
      });

      render(<HomeScreen />);
      
      // UnauthenticatedHomeScreenコンポーネントがレンダリングされることを確認
      expect(screen.getByTestId('unauthenticated-home-screen')).toBeTruthy();
      expect(screen.getByText('Unauthenticated Home Screen')).toBeTruthy();
    });

    it('認証済みだがユーザーが存在しない時、UnauthenticatedHomeScreenを表示する', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: true,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
      });
      mockUseHomeData.mockReturnValue({
        goalData: { count: 0, loading: false, error: null },
        refreshing: false,
        onRefresh: jest.fn(),
        fetchGoalCount: jest.fn(),
      });

      render(<HomeScreen />);
      
      // UnauthenticatedHomeScreenコンポーネントがレンダリングされることを確認
      expect(screen.getByTestId('unauthenticated-home-screen')).toBeTruthy();
      expect(screen.getByText('Unauthenticated Home Screen')).toBeTruthy();
    });
  });
});