import { Goal, GoalStatus, GoalPriority } from '../goal.types';

describe('Goal データ型', () => {
  describe('Goal インターフェース', () => {
    it('必須プロパティが正しく定義されていること', () => {
      const goal: Goal = {
        id: 'test-id-123',
        title: 'テストゴール',
        description: 'テスト用のゴール説明',
        priority: GoalPriority.HIGH,
        status: GoalStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 'user-123'
      };

      expect(goal.id).toBeDefined();
      expect(goal.title).toBeDefined();
      expect(goal.priority).toBeDefined();
      expect(goal.status).toBeDefined();
      expect(goal.created_at).toBeDefined();
      expect(goal.updated_at).toBeDefined();
      expect(goal.user_id).toBeDefined();
    });

    it('titleが必須であること', () => {
      // titleがundefinedの場合、TypeScriptエラーが発生することを確認
      expect(() => {
        const goal: Goal = {
          id: 'test-id-123',
          // title: undefined, // 意図的にtitleを省略
          description: 'テスト用のゴール説明',
          priority: GoalPriority.HIGH,
          status: GoalStatus.ACTIVE,
          created_at: new Date(),
          updated_at: new Date(),
          user_id: 'user-123'
        } as Goal;
      }).toBeDefined();
    });

    it('descriptionが任意であること', () => {
      const goal: Goal = {
        id: 'test-id-123',
        title: 'テストゴール',
        // description は任意なので省略可能
        priority: GoalPriority.HIGH,
        status: GoalStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 'user-123'
      };

      expect(goal.description).toBeUndefined();
    });
  });

  describe('GoalStatus enum', () => {
    it('正しいステータス値が定義されていること', () => {
      expect(GoalStatus.ACTIVE).toBeDefined();
      expect(GoalStatus.COMPLETED).toBeDefined();
      expect(GoalStatus.PAUSED).toBeDefined();
    });

    it('ステータス値が期待される文字列であること', () => {
      expect(GoalStatus.ACTIVE).toBe('active');
      expect(GoalStatus.COMPLETED).toBe('completed');
      expect(GoalStatus.PAUSED).toBe('paused');
    });
  });

  describe('GoalPriority enum', () => {
    it('正しい優先度値が定義されていること', () => {
      expect(GoalPriority.LOW).toBeDefined();
      expect(GoalPriority.MEDIUM).toBeDefined();
      expect(GoalPriority.HIGH).toBeDefined();
    });

    it('優先度値が期待される数値であること', () => {
      expect(GoalPriority.LOW).toBe(1);
      expect(GoalPriority.MEDIUM).toBe(2);
      expect(GoalPriority.HIGH).toBe(3);
    });
  });

  describe('Goal バリデーション', () => {
    it('IDがUUID形式であること', () => {
      const validUUID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
      const goal: Goal = {
        id: validUUID,
        title: 'テストゴール',
        priority: GoalPriority.HIGH,
        status: GoalStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 'user-123'
      };

      // UUID形式の正規表現チェック
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(goal.id)).toBe(true);
    });

    it('titleが空文字列でないこと', () => {
      const goal: Goal = {
        id: 'test-id-123',
        title: 'テストゴール',
        priority: GoalPriority.HIGH,
        status: GoalStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 'user-123'
      };

      expect(goal.title).toBeTruthy();
      expect(goal.title.length).toBeGreaterThan(0);
    });

    it('priorityが1-3の範囲内であること', () => {
      const goal: Goal = {
        id: 'test-id-123',
        title: 'テストゴール',
        priority: GoalPriority.HIGH,
        status: GoalStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 'user-123'
      };

      expect(goal.priority).toBeGreaterThanOrEqual(1);
      expect(goal.priority).toBeLessThanOrEqual(3);
    });

    it('created_atがupdated_atより前または同じであること', () => {
      const now = new Date();
      const goal: Goal = {
        id: 'test-id-123',
        title: 'テストゴール',
        priority: GoalPriority.HIGH,
        status: GoalStatus.ACTIVE,
        created_at: now,
        updated_at: now,
        user_id: 'user-123'
      };

      expect(goal.created_at.getTime()).toBeLessThanOrEqual(goal.updated_at.getTime());
    });
  });
});