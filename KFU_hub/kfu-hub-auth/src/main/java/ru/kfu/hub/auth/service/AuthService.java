package ru.kfu.hub.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kfu.hub.auth.dto.request.LoginRequest;
import ru.kfu.hub.auth.dto.request.RefreshTokenRequest;
import ru.kfu.hub.auth.dto.request.RegisterRequest;
import ru.kfu.hub.auth.dto.response.AuthResponse;
import ru.kfu.hub.auth.dto.response.UserResponse;
import ru.kfu.hub.auth.entity.RefreshToken;
import ru.kfu.hub.auth.entity.User;
import ru.kfu.hub.auth.exception.AuthException;
import ru.kfu.hub.auth.repository.RefreshTokenRepository;
import ru.kfu.hub.auth.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.refresh-token-expiration-days}")
    private long refreshTokenExpirationDays;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new AuthException("Пользователь с таким именем уже существует", HttpStatus.CONFLICT);
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new AuthException("Пользователь с таким email уже существует", HttpStatus.CONFLICT);
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .role(request.role())
                .enabled(true)
                .build();

        userRepository.save(user);
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new AuthException("Неверное имя пользователя или пароль", HttpStatus.UNAUTHORIZED));

        if (!user.isEnabled()) {
            throw new AuthException("Учётная запись заблокирована", HttpStatus.FORBIDDEN);
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new AuthException("Неверное имя пользователя или пароль", HttpStatus.UNAUTHORIZED);
        }

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new AuthException("Refresh token не найден", HttpStatus.UNAUTHORIZED));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new AuthException("Refresh token истёк. Войдите снова", HttpStatus.UNAUTHORIZED);
        }

        User user = refreshToken.getUser();
        String newAccessToken = jwtService.generateAccessToken(user);

        return AuthResponse.of(
                newAccessToken,
                refreshToken.getToken(),
                jwtService.getAccessTokenExpirationMs(),
                UserResponse.from(user)
        );
    }

    @Transactional
    public void logout(RefreshTokenRequest request) {
        refreshTokenRepository.findByToken(request.refreshToken())
                .ifPresent(refreshTokenRepository::delete);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String rawRefreshToken = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .token(rawRefreshToken)
                .user(user)
                .expiresAt(LocalDateTime.now().plusDays(refreshTokenExpirationDays))
                .build();

        refreshTokenRepository.save(refreshToken);

        return AuthResponse.of(
                accessToken,
                rawRefreshToken,
                jwtService.getAccessTokenExpirationMs(),
                UserResponse.from(user)
        );
    }
}
