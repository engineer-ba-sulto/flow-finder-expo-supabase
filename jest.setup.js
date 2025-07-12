import '@testing-library/jest-native/extend-expect';

// React Native モック
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Expo Router モック
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  Link: ({ children, href, ...props }) => children,
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

// React Native Reanimated モック
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// NativeWind CSS imports は moduleNameMapper でハンドル

global.__reanimatedWorkletInit = () => {};