-- 扩展用户状态支持 pending（待审核）
-- 版本: v1.1

-- 1. 先删除旧约束
ALTER TABLE users_auth DROP CONSTRAINT IF EXISTS chk_status;

-- 2. 添加新约束（支持 pending/active/disabled）
ALTER TABLE users_auth ADD CONSTRAINT chk_status CHECK (status IN ('pending', 'active', 'disabled'));

-- 3. 更新注释
COMMENT ON COLUMN users_auth.status IS '账号状态：pending-待审核, active-正常, disabled-禁用';
