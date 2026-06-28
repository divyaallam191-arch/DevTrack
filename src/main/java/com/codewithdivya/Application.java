package com.codewithdivya;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;



//@OpenAPIDefinition(
//        info = @Info(
//                title = "Software Engineer API",
//                version = "1.0",
//                description = "REST API to manage Software Engineers built with Spring Boot & JPA",
//                contact = @Contact(
//                        name = "Divya",
//                        email = "divyaallam191@gmail.com"
//                )
//        )
//)
@SpringBootApplication
@RestController
public class Application {

    public static void main(String[] args) {

        SpringApplication.run(Application.class, args);
    }
    @GetMapping
    public String HelloWorld(){
        return "Welcome to the World of SpingBoot";
    }
}
