package com.codewithdivya.security;

import com.codewithdivya.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {

        byte[] keyBytes = Decoders.BASE64.decode(secret);

        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(User user) {

        return Jwts.builder()

                .subject(user.getEmail())

                .claim("role", user.getRole().name())

                .issuedAt(new Date())

                .expiration(new Date(System.currentTimeMillis() + expiration))

                .signWith(getSigningKey(), SignatureAlgorithm.HS256)

                .compact();
    }

    public String extractUsername(String token) {

        return extractClaim(token, Claims::getSubject);

    }

    public Date extractExpiration(String token) {

        return extractClaim(token, Claims::getExpiration);

    }

    public <T> T extractClaim(String token,
                              Function<Claims, T> claimsResolver) {

        Claims claims = Jwts.parser()

                .verifyWith(getSigningKey())

                .build()

                .parseSignedClaims(token)

                .getPayload();

        return claimsResolver.apply(claims);

    }

    public boolean isTokenExpired(String token) {

        return extractExpiration(token).before(new Date());

    }

    public boolean validateToken(String token, UserDetails userDetails) {

        String email = extractUsername(token);

        return email.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }


}