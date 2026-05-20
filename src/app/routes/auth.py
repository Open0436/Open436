"""
认证授权路由
实现用户注册、登录、获取当前用户信息
"""
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional

from src.app.models.database import get_db
from src.app.models.auth_schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    AuthSuccessResponse,
    LoginResponseData,
    UserInfoResponse
)
from src.app.services.auth_service import AuthService

router = APIRouter()


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    """获取认证服务实例"""
    return AuthService(db)


def get_current_user_from_header(
    authorization: Optional[str] = Header(None),
    service: AuthService = Depends(get_auth_service)
):
    """从请求头中提取当前用户"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="缺少认证信息"
        )

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="认证格式错误，请使用 Bearer Token"
        )

    user = service.get_current_user(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token 无效或已过期"
        )

    if user.status == "banned":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="账号已被禁用"
        )

    return user


@router.post("/register", response_model=AuthSuccessResponse, summary="用户注册")
async def register(
    data: UserRegisterRequest,
    service: AuthService = Depends(get_auth_service)
):
    """
    用户注册

    - 用户名 3-20 字符，仅允许字母、数字、下划线
    - 密码至少 6 位
    - 昵称可选，默认同用户名
    """
    result = service.register(data)
    return AuthSuccessResponse(
        code=200,
        message="注册成功",
        data=result
    )


@router.post("/login", response_model=AuthSuccessResponse, summary="用户登录")
async def login(
    data: UserLoginRequest,
    service: AuthService = Depends(get_auth_service)
):
    """
    用户登录

    - 返回 JWT Token 和用户信息
    - Token 有效期 7 天
    """
    result = service.login(data.username, data.password)
    return AuthSuccessResponse(
        code=200,
        message="登录成功",
        data=result
    )


@router.get("/me", response_model=AuthSuccessResponse, summary="获取当前用户信息")
async def get_me(
    user=Depends(get_current_user_from_header)
):
    """
    获取当前登录用户信息

    - 需要在请求头中携带 Authorization: Bearer \u003ctoken\u003e
    """
    return AuthSuccessResponse(
        code=200,
        message="success",
        data={"user": user.to_dict()}
    )
