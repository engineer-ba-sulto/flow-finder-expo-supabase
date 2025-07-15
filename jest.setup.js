import '@testing-library/jest-native/extend-expect';

// React Native の基本的なモック
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // React Native コンポーネントをモック
  RN.NativeModules = RN.NativeModules || {};
  
  return RN;
});

// React Native のEventEmitterモック
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Expo Router モックはテストファイル内で個別定義

// React Native Reanimated モック
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// React Native Safe Area Context モック
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

global.__reanimatedWorkletInit = () => {};