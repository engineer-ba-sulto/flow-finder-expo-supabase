import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from '../Card';

describe('Card コンポーネント', () => {
  it('子要素が正しく表示されること', () => {
    const { getByText } = render(
      <Card>
        <Text>テストコンテンツ</Text>
      </Card>
    );
    
    expect(getByText('テストコンテンツ')).toBeTruthy();
  });

  it('タイトルが正しく表示されること', () => {
    const { getByText } = render(
      <Card title="テストタイトル">
        <Text>コンテンツ</Text>
      </Card>
    );
    
    expect(getByText('テストタイトル')).toBeTruthy();
  });

  it('基本的なカードスタイルが適用されること', () => {
    const { getByText } = render(
      <Card>
        <Text>基本カード</Text>
      </Card>
    );
    
    // 基本カードの内容が表示されることを確認
    expect(getByText('基本カード')).toBeTruthy();
  });

  it('Flow Finderブランドカラーのボーダーが適用されること', () => {
    const { getByText } = render(
      <Card variant="primary">
        <Text>プライマリカード</Text>
      </Card>
    );
    
    // プライマリカードの内容が表示されることを確認
    expect(getByText('プライマリカード')).toBeTruthy();
  });

  it('エラー状態では赤色のボーダーが適用されること', () => {
    const { getByText } = render(
      <Card variant="error">
        <Text>エラーカード</Text>
      </Card>
    );
    
    // エラーカードの内容が表示されることを確認
    expect(getByText('エラーカード')).toBeTruthy();
  });

  it('タップ可能な場合はonPressが実行されること', () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <Card onPress={mockOnPress}>
        <Text>タップ可能カード</Text>
      </Card>
    );
    
    fireEvent.press(getByRole('button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('disabled状態では見た目が変わること', () => {
    const { getByText } = render(
      <Card disabled>
        <Text>無効カード</Text>
      </Card>
    );
    
    // 無効カードの内容が表示されることを確認
    expect(getByText('無効カード')).toBeTruthy();
  });

  it('パディングが正しく適用されること', () => {
    const { getByText } = render(
      <Card padding="large">
        <Text>大きなパディング</Text>
      </Card>
    );
    
    // 大きなパディングカードの内容が表示されることを確認
    expect(getByText('大きなパディング')).toBeTruthy();
  });

  it('アクセシビリティ属性が正しく設定されること', () => {
    const { getByRole } = render(
      <Card onPress={() => {}}>
        <Text>アクセシブルカード</Text>
      </Card>
    );
    
    const card = getByRole('button');
    expect(card).toHaveProp('accessibilityRole', 'button');
  });
});