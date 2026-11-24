package com.retrievo.backend.service.impl;

import com.retrievo.backend.entity.PasswordResetToken;
import com.retrievo.backend.entity.User;
import com.retrievo.backend.repository.PasswordResetTokenRepository;
import com.retrievo.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${app.reset-password.url}")
    private String resetPasswordUrl;

    @Value("${app.reset-password.expiration}")
    private long tokenExpiration;

    private final SecureRandom secureRandom = new SecureRandom();

    // ==========================================
    // FORGOT PASSWORD
    // ==========================================

    @Override
    @Transactional
    public void forgotPassword(String email) {

        String normalizedEmail = email.trim().toLowerCase();

        // Find user
        User user = userRepository.findByEmail(normalizedEmail);

        // Don't reveal whether an email exists
        if (user == null || !user.isEnabled()) {
            return;
        }

        // Delete previous reset tokens
        tokenRepository.deleteByUser(user);

        // Generate secure random token
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        String rawToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        // Hash token before storing it
        String hashedToken = hashToken(rawToken);

        // Create reset token entity
        PasswordResetToken resetToken = new PasswordResetToken();

        resetToken.setToken(hashedToken);
        resetToken.setUser(user);
        resetToken.setExpiryDate(
                LocalDateTime.now().plusSeconds(tokenExpiration / 1000)
        );
        resetToken.setUsed(false);

        // Save hashed token
        tokenRepository.save(resetToken);

        // Create reset link
        String resetLink = resetPasswordUrl + "?token=" + rawToken;

        // Prepare email
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(user.getEmail());
        message.setSubject("Retrievo - Password Reset Request");

        message.setText(
                "Hello " + user.getFullName() + ",\n\n" +

                        "We received a request to reset your Retrievo account password.\n\n" +

                        "Click the link below to reset your password:\n\n" +

                        resetLink + "\n\n" +

                        "This link will expire in 15 minutes and can only be used once.\n\n" +

                        "If you did not request a password reset, please ignore this email.\n\n" +

                        "Regards,\n" +
                        "Retrievo Team"
        );

        // Send email
        System.out.println("Attempting to send email to: " + user.getEmail());

        try {
            mailSender.send(message);
            System.out.println("EMAIL SENT SUCCESSFULLY!");
        } catch (Exception e) {
            System.out.println("EMAIL SENDING FAILED!");
            e.printStackTrace();
            throw e;
        }
    }

    // ==========================================
    // RESET PASSWORD
    // ==========================================

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {

        // Hash the received token
        String hashedToken = hashToken(token);

        // Find token in database
        PasswordResetToken resetToken = tokenRepository
                .findByToken(hashedToken)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid or expired password reset link"
                        )
                );

        // Check whether token was already used
        if (resetToken.isUsed()) {
            throw new IllegalArgumentException(
                    "This password reset link has already been used"
            );
        }

        // Check expiry
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Password reset link has expired"
            );
        }

        User user = resetToken.getUser();

        // Check whether account is active
        if (!user.isEnabled()) {
            throw new IllegalArgumentException(
                    "Your account is disabled"
            );
        }

        // Prevent using the same password
        if (passwordEncoder.matches(
                newPassword,
                user.getPassword()
        )) {
            throw new IllegalArgumentException(
                    "New password must be different from your current password"
            );
        }

        // Encode and update password
        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);

        tokenRepository.save(resetToken);
    }

    // ==========================================
    // SHA-256 TOKEN HASHING
    // ==========================================

    private String hashToken(String token) {

        try {

            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hashedBytes = digest.digest(
                    token.getBytes(java.nio.charset.StandardCharsets.UTF_8)
            );

            return java.util.HexFormat.of().formatHex(hashedBytes);

        } catch (Exception e) {

            throw new IllegalStateException(
                    "Unable to hash password reset token",
                    e
            );
        }
    }
}