import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SimpleGoalCompletion } from '../SimpleGoalCompletion';

describe('SimpleGoalCompletion コンポーネント', () => {
  it('ゴール完了マークボタンが表示されること', () => {
    const mockOnToggle = jest.fn();
    const { getByText } = render(
      <SimpleGoalCompletion 
        goalId="test-goal-1" 
        isCompleted={false} 
        onToggle={mockOnToggle} 
      />
    );
    
    const button = getByText('ゴール完了マーク');
    expect(button).toBeDefined();
  });

  it('未完了状態では成功色（bg-success）でボタンが表示されること', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId } = render(
      <SimpleGoalCompletion 
        goalId="test-goal-1" 
        isCompleted={false} 
        onToggle={mockOnToggle} 
      />
    );
    
    const button = getByTestId('goal-completion-button');
    // NativeWindクラスが適用されているかテスト
    expect(button.props.className).toContain('bg-green-500');
  });

  it('完了状態では異なるスタイルでボタンが表示されること', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId } = render(
      <SimpleGoalCompletion 
        goalId="test-goal-1" 
        isCompleted={true} 
        onToggle={mockOnToggle} 
      />
    );
    
    const button = getByTestId('goal-completion-button');
    expect(button.props.className).toContain('bg-gray-400');
  });

  it('ボタンタップで完了状態の切り替え関数が呼ばれること', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId } = render(
      <SimpleGoalCompletion 
        goalId="test-goal-1" 
        isCompleted={false} 
        onToggle={mockOnToggle} 
      />
    );
    
    const button = getByTestId('goal-completion-button');
    fireEvent.press(button);
    
    expect(mockOnToggle).toHaveBeenCalledWith('test-goal-1');
  });

  it('MVP2段目予告メッセージが表示されること', () => {
    const mockOnToggle = jest.fn();
    const { getByText } = render(
      <SimpleGoalCompletion 
        goalId="test-goal-1" 
        isCompleted={false} 
        onToggle={mockOnToggle} 
      />
    );
    
    const message = getByText('※ MVP2段目でアクション機能追加予定');
    expect(message).toBeDefined();
  });

  it('適切なアクセシビリティプロパティが設定されること', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId } = render(
      <SimpleGoalCompletion 
        goalId="test-goal-1" 
        isCompleted={false} 
        onToggle={mockOnToggle} 
      />
    );
    
    const button = getByTestId('goal-completion-button');
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityLabel).toBe('ゴール完了マーク');
  });
});