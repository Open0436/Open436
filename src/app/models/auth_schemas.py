"""
认证相关 Pydantic 数据模式
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional


class UserRegisterRequest(BaseModel):
    """用户注册请求"""
    username: str = Field(..., min_length=3, max_length=20, description="用户名")
    password: str = Field(..., min_length=6, max_length=100, description="密码")
    nickname: Optional[str] = Field(None, max_length=30, description="昵称（可选）")

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        """验证用户名格式"""
        import re
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("用户名只能包含字母、数字和下划线")
        return v


class UserLoginRequest(BaseModel):
    """用户登录请求"""
    username: str = Field(..., description="用户名")
    password: str = Field(..., description="密码")


class UserInfoResponse(BaseModel):
    """用户信息响应"""
    id: int
    username: str
    nickname: str
    avatar: str
    role: str
    status: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class LoginResponseData(BaseModel):
    """登录成功响应数据"""
    token: str
    user: UserInfoResponse


class AuthSuccessResponse(BaseModel):
    """统一认证成功响应"""
    code: int = 200
    message: str = "success"
    data: Optional[dict] = None


class AuthErrorResponse(BaseModel):
    """统一认证错误响应"""
    code: int = 400
    message: str
    detail: Optional[str] = None
