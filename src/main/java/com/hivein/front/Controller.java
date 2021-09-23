package com.hivein.front;

import org.springframework.web.bind.annotation.RequestMapping;

@org.springframework.stereotype.Controller
public class Controller {
    // Match everything without a suffix (so not a static resource)
    @RequestMapping(value = "/**/{path:[^.]*}")
    public String redirect() {
        // Forward to home page so that route is preserved.(i.e forward:/intex.html)
        return "forward:/";
    }
}
