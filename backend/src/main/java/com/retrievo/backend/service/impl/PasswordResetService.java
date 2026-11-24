package com.retrievo.backend.service.impl;

public interface PasswordResetService {

    void forgotPassword(String email);

    void resetPassword(String token, String newPassword);
}