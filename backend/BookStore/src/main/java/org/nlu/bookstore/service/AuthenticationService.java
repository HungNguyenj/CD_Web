package org.nlu.bookstore.service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.nlu.bookstore.dto.request.AuthenticationRequest;
import org.nlu.bookstore.dto.request.ForgotPasswordRequest;
import org.nlu.bookstore.dto.request.IntrospectRequest;
import org.nlu.bookstore.dto.request.ResetPasswordRequest;
import org.nlu.bookstore.dto.response.AuthenticationResponse;
import org.nlu.bookstore.dto.response.ForgotPasswordResponse;
import org.nlu.bookstore.dto.response.IntrospectResponse;
import org.nlu.bookstore.dto.response.UserResponse;
import org.nlu.bookstore.entity.OtpToken;
import org.nlu.bookstore.entity.Role;
import org.nlu.bookstore.entity.User;
import org.nlu.bookstore.enums.RoleName;
import org.nlu.bookstore.exception.AppException;
import org.nlu.bookstore.exception.ErrorCode;
import org.nlu.bookstore.repository.OtpTokenRepository;
import org.nlu.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Random;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    UserRepository userRepository;
    EmailService emailService;
    OtpTokenRepository otpTokenRepository;
    private final PasswordEncoder passwordEncoder;

    @NonFinal
    @Value("${jwt.signerKey}")
    String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    long VALID_DURATION;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .isAdmin(checkAdmin(user))
                .build();
    }

    private boolean checkAdmin(User user) {
        for (Role role : user.getRoles()) {
            if (RoleName.ADMIN.name().equals(role.getName())) {
                return true;
            }
        }
        return false;
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws ParseException, JOSEException {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token);
        } catch (AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    private SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);

        MACVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        //check expiry time
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        // verify
        boolean verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date())))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        //

        return signedJWT;
    }

    private String generateToken(User user) {
        //header
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        //body - payload
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("bookstore.nlu.org")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        //SignedJWT
        SignedJWT signedJWT = new SignedJWT(jwsHeader, jwtClaimsSet);

        try {
            signedJWT.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return signedJWT.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
            });
        }

        return stringJoiner.toString();
    }

    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String otp = String.format("%06d", new Random().nextInt(999999)); // generate OTP

        OtpToken token = OtpToken.builder()
                .email(user.getEmail())
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .used(false)
                .build();
        otpTokenRepository.save(token);

        emailService.sendMail(request.getEmail(), "Mã OTP đặt lại mật khẩu",
                "Mã OTP của bạn là: " + otp + " có hiệu lực trong 5 phút!");

        return ForgotPasswordResponse.builder()
                .message("Email sent")
                .build();
    }

    public Boolean verifyOtp(String email, String otp) {
        OtpToken otpToken = otpTokenRepository.findByEmailAndOtp(email, otp)
                .orElseThrow(() -> new AppException(ErrorCode.OTP_INVALID));

        if (otpToken.isUsed())
            throw new AppException(ErrorCode.OTP_IS_USED);

        if (otpToken.getExpiryTime().isBefore(LocalDateTime.now()))
            throw new AppException(ErrorCode.OTP_IS_EXPIRY);

        otpToken.setUsed(true);
        otpTokenRepository.save(otpToken);

        return true;
    }

    public UserResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .address(user.getAddress())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}
