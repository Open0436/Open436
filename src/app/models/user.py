"""
用户数据模型（SQLAlchemy ORM）
"""
from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, Boolean
from sqlalchemy.sql import func
from enum import Enum as PyEnum

from src.app.models.database import Base


class UserRole(str, PyEnum):
    """用户角色枚举"""
    USER = "user"
    ADMIN = "admin"


class UserStatus(str, PyEnum):
    """用户状态枚举"""
    ACTIVE = "active"
    BANNED = "banned"


class User(Base):
    """用户模型"""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # 用户名（登录用，唯一）
    username = Column(String(20), unique=True, nullable=False, index=True)

    # 昵称（显示用，可空，默认与用户名相同）
    nickname = Column(String(30), nullable=True)

    # 密码哈希（bcrypt）
    password_hash = Column(String(255), nullable=False)

    # 头像URL
    avatar = Column(String(500), nullable=True)

    # 角色
    role = Column(String(10), nullable=False, default=UserRole.USER.value)

    # 状态
    status = Column(String(10), nullable=False, default=UserStatus.ACTIVE.value)

    # 时间戳
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now()
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"

    def to_dict(self):
        """转换为字典（不包含密码）"""
        return {
            "id": self.id,
            "username": self.username,
            "nickname": self.nickname or self.username,
            "avatar": self.avatar or f"https://ui-avatars.com/api/?name={self.username}&background=1976D2&color=fff",
            "role": self.role,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
