package com.example.democookie.controller;

import com.example.democookie.model.Cookie;
import com.example.democookie.repository.CookieRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("cookie")
public class CookieController {

    private final CookieRepository cookieRepository;

    public CookieController(CookieRepository cookieRepository) {
        this.cookieRepository = cookieRepository;
    }

    @GetMapping
    public List<Cookie> list() {
        List<Cookie> cookies = cookieRepository.findAll();
        return cookies;
    }

    @GetMapping("{id}")
    public Cookie getOne(@PathVariable("id") Cookie cookie) {
        return cookie;
    }

    @PostMapping
    public Cookie create(@RequestBody Cookie cookie) {
        return cookieRepository.save(cookie);
    }

    @PutMapping("{id}")
    public Cookie update(@PathVariable("id") Cookie cookieFromDb,
                         @RequestBody Cookie cookie) {
        BeanUtils.copyProperties(cookie, cookieFromDb, "id");
        return cookieRepository.save(cookie);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Cookie cookie) {
        cookieRepository.delete(cookie);
    }
}
