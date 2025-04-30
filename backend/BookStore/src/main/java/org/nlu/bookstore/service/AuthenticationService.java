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
import lombok.extern.slf4j.Slf4j;
import org.nlu.bookstore.dto.request.AuthenticationRequest;
import org.nlu.bookstore.dto.request.IntrospectRequest;
import org.nlu.bookstore.dto.response.AuthenticationResponse;
import org.nlu.bookstore.dto.response.IntrospectResponse;
import org.nlu.bookstore.entity.User;
import org.nlu.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGN_KEY;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository.findByUserName(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not existed"));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) {
            throw new RuntimeException("Unauthenticated");
        }

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws ParseException, JOSEException {
        var token = request.getToken();

        SignedJWT signedJWT = SignedJWT.parse(token);

        MACVerifier verifier =new MACVerifier(SIGN_KEY.getBytes());

        //check date
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        //verify
        var verified = signedJWT.verify(verifier);

        return IntrospectResponse.builder()
                .valid(verified && expiryTime.after(new Date()))
                .build();
    }

    private String generateToken(User user) {
        //header
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        //claimsSet
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUserName())
                .issuer("bookstore.nlu.org")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.DAYS).toEpochMilli()
                ))
                .claim("scope", user.getRole().getName())
                .build();

        //object
        SignedJWT signedJWT = new SignedJWT(jwsHeader, jwtClaimsSet);

        try {
            signedJWT.sign(new MACSigner(SIGN_KEY.getBytes()));
            return signedJWT.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }


}
