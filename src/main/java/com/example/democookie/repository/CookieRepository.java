package com.example.democookie.repository;

import com.example.democookie.model.Cookie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CookieRepository extends JpaRepository<Cookie, Long> {
}
