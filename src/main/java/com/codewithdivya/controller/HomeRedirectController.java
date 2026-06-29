package com.codewithdivya.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeRedirectController {

    @GetMapping("/")
    public String redirectToHome() {
        return "redirect:/index.html";
    }
}
