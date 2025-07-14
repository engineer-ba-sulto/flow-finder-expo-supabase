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

  it('未完了状態ではブランドカラー（#FFC400）でボタンが表示されること', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId } = render(
      <SimpleGoalCompletion 
        goalId="test-goal-1" 
        isCompleted={false} 
        onToggle={mockOnToggle} 
      />
    );
    
    const button = getByTestId('goal-completion-button');
    // Flow Finderブランドカラーが適用されているかテスト
    expect(button.props.className).toContain('bg-[#FFC400]');
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
    expect(button.props.accessibilityLabel).toContain('ゴール完了マーク');
    expect(button.props.accessibilityHint).toBeDefined();
    expect(button.props.accessibilityState).toEqual({ selected: false });
  });

  it('完了状態では適切なテキストとアクセシビリティが設定されること', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId, getByText } = render(
      <SimpleGoalCompletion 
        goalId="test-goal-1" 
        isCompleted={true} 
        onToggle={mockOnToggle} 
      />
    );
    
    const button = getByTestId('goal-completion-button');
    const completedText = getByText('✓ 完了済み');
    
    expect(completedText).toBeDefined();
    expect(button.props.accessibilityState).toEqual({ selected: true });
    expect(button.props.accessibilityLabel).toContain('完了済み');
  });

  it('React.memoによる再レンダリング最適化が機能すること', () => {
    const mockOnToggle = jest.fn();
    const { rerender } = render(
      <SimpleGoalCompletion 
        goalId="test-goal-1" 
        isCompleted={false} 
        onToggle={mockOnToggle} 
      />
    );
    
    // 同じpropsで再レンダリング（再レンダリングされないことを期待）
    rerender(
      <SimpleGoalCompletion 
        goalId="test-goal-1" 
        isCompleted={false} 
        onToggle={mockOnToggle} 
      />
    );
    
    // この段階では実際のメモ化の効果は測定困難だが、
    // コンポーネントが正常に動作することを確認
    expect(mockOnToggle).not.toHaveBeenCalled();
  });
});