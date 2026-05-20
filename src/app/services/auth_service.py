"""
认证服务层
处理用户注册、登录、密码哈希、JWT 签发与验证
"""
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from src.config import settings
from src.app.models.user import User
from src.app.models.auth_schemas import UserRegisterRequest

# 密码哈希上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """哈希密码"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """创建 JWT 访问令牌"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """解码 JWT 令牌"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None


class AuthService:
    """认证服务类"""

    def __init__(self, db: Session):
        self.db = db

    def get_user_by_username(self, username: str) -> Optional[User]:
        """根据用户名获取用户"""
        return self.db.query(User).filter(User.username == username).first()

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """根据 ID 获取用户"""
        return self.db.query(User).filter(User.id == user_id).first()

    def register(self, data: UserRegisterRequest) -> dict:
        """
        用户注册

        Returns:
            dict: { user: 用户信息 }
        """
        # 检查用户名是否已存在
        existing = self.get_user_by_username(data.username)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"用户名 '{data.username}' 已被注册"
            )

        # 创建用户
        user = User(
            username=data.username,
            nickname=data.nickname or data.username,
            password_hash=hash_password(data.password),
            avatar=f"https://ui-avatars.com/api/?name={data.username}&background=1976D2&color=fff",
            role="user",
            status="active"
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return {
            "user": user.to_dict()
        }

    def login(self, username: str, password: str) -> dict:
        """
        用户登录

        Returns:
            dict: { token, user }
        """
        user = self.get_user_by_username(username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="用户名或密码错误"
            )

        if user.status == "banned":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="账号已被禁用"
            )

        if not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="用户名或密码错误"
            )

        # 签发 JWT
        token = create_access_token({"sub": str(user.id), "username": user.username, "role": user.role})

        return {
            "token": token,
            "user": user.to_dict()
        }

    def get_current_user(self, token: str) -> Optional[User]:
        """根据 Token 获取当前用户"""
        payload = decode_token(token)
        if not payload:
            return None

        user_id = payload.get("sub")
        if not user_id:
            return None

        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            return None

        return self.get_user_by_id(user_id)
