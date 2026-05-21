package com.open436.auth.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.stp.StpUtil;
import com.open436.auth.dto.*;
import com.open436.auth.enums.TokenConstants;
import com.open436.auth.service.AuthService;
import com.open436.auth.service.RoleService;
import com.open436.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 * 处理登录、登出等认证相关请求
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final UserService userService;
    private final RoleService roleService;
    
    /**
     * 用户注册（新用户默认 pending，需管理员审核后登录）
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody RegisterRequest request) {

        log.info("注册请求: username={}", request.getUsername());

        // 创建用户（默认 role=user, status=pending）
        CreateUserRequest createRequest = new CreateUserRequest();
        createRequest.setUsername(request.getUsername());
        createRequest.setPassword(request.getPassword());
        createRequest.setRole("user");
        createRequest.setStatus("pending");
        userService.createUser(createRequest);

        return ResponseEntity.ok(
            ApiResponse.<Void>builder()
                .code(200)
                .message("注册成功，请等待管理员审核")
                .timestamp(System.currentTimeMillis())
                .build()
        );
    }

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        
        log.info("登录请求: username={}", request.getUsername());
        
        LoginResponse response = authService.login(request);
        
        return ResponseEntity.ok(
            ApiResponse.<LoginResponse>builder()
                .code(200)
                .message("登录成功")
                .data(response)
                .timestamp(System.currentTimeMillis())
                .build()
        );
    }
    
    /**
     * 管理端登录（仅允许 admin 角色）
     */
    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<LoginResponse>> adminLogin(
            @Valid @RequestBody LoginRequest request) {

        log.info("管理端登录请求: username={}", request.getUsername());

        LoginResponse response = authService.login(request);

        // 校验角色必须是 admin
        if (!"admin".equals(response.getUser().getRole())) {
            log.warn("管理端登录拒绝: username={}, role={}", request.getUsername(), response.getUser().getRole());
            return ResponseEntity.status(403).body(
                ApiResponse.<LoginResponse>builder()
                    .code(403)
                    .message("无管理员权限")
                    .timestamp(System.currentTimeMillis())
                    .build()
            );
        }

        return ResponseEntity.ok(
            ApiResponse.<LoginResponse>builder()
                .code(200)
                .message("登录成功")
                .data(response)
                .timestamp(System.currentTimeMillis())
                .build()
        );
    }

    /**
     * 用户登出
     */
    @PostMapping("/logout")
    @SaCheckLogin
    public ResponseEntity<ApiResponse<Void>> logout() {
        log.info("登出请求");
        
        authService.logout();
        
        return ResponseEntity.ok(
            ApiResponse.<Void>builder()
                .code(200)
                .message("已成功退出登录")
                .timestamp(System.currentTimeMillis())
                .build()
        );
    }
    
    /**
     * 获取当前登录用户信息
     */
    @GetMapping("/current")
    @SaCheckLogin
    public ResponseEntity<ApiResponse<UserInfoResponse>> getCurrentUser() {
        log.info("获取当前用户信息");
        
        UserInfoResponse userInfo = authService.getCurrentUser();
        
        return ResponseEntity.ok(
            ApiResponse.<UserInfoResponse>builder()
                .code(200)
                .message("获取成功")
                .data(userInfo)
                .timestamp(System.currentTimeMillis())
                .build()
        );
    }
    
    /**
     * 验证 Token（供 Kong Gateway 调用）
     */
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<TokenVerifyResponse>> verifyToken(
            @RequestBody TokenVerifyRequest request) {
        
        log.debug("Token 验证请求");
        
        try {
            // 验证 Token
            Object loginId = StpUtil.getLoginIdByToken(request.getToken());
            
            if (loginId == null) {
                return ResponseEntity.ok(
                    ApiResponse.success(new TokenVerifyResponse(false, null))
                );
            }
            
            // 获取用户信息
            Long userId = Long.parseLong(loginId.toString());
            
            // 切换到该用户的上下文来获取 Session
            Object originalLoginId = StpUtil.getLoginIdDefaultNull();
            try {
                StpUtil.switchTo(userId);
                String username = (String) StpUtil.getSession().get(TokenConstants.SESSION_KEY_USERNAME);
                String role = roleService.getUserRoleCodes(userId).stream()
                    .findFirst().orElse("user");
                
                UserTokenInfo userInfo = new UserTokenInfo(userId, username, role);
                TokenVerifyResponse response = new TokenVerifyResponse(true, userInfo);
                
                log.debug("Token 验证成功: userId={}, username={}", userId, username);
                
                return ResponseEntity.ok(ApiResponse.success(response));
            } finally {
                // 恢复原来的登录状态
                if (originalLoginId != null) {
                    StpUtil.switchTo(originalLoginId);
                } else {
                    StpUtil.logout();
                }
            }
        } catch (Exception e) {
            log.warn("Token 验证失败: {}", e.getMessage());
            return ResponseEntity.ok(
                ApiResponse.success(new TokenVerifyResponse(false, null))
            );
        }
    }
}


