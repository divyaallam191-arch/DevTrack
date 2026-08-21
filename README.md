# 🚀 DevTrack

**A full-stack developer management platform built with Java 21, Spring Boot, Spring Security, JWT, MySQL, and Vanilla JavaScript.**

[![Java](https://img.shields.io/badge/Java-21-orange)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-Framework-brightgreen)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-Security-green)](https://spring.io/projects/spring-security)
[![MySQL](https://img.shields.io/badge/MySQL-Database-blue)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED)](https://www.docker.com/)

**Live Application:** (https://devtrack19.onrender.com/)

## 📖 API Documentation

DevTrack provides interactive API documentation using **Swagger/OpenAPI**.


```text
https://devtrack19.onrender.com/swagger-ui/index.html
```

---

## 📌 Overview

DevTrack is a full-stack web application for managing software developer records through a secure and responsive interface.

The application implements **JWT-based authentication**, **Spring Security authorization**, **BCrypt password encryption**, and **RESTful CRUD APIs** backed by MySQL. The frontend communicates with the backend APIs using Vanilla JavaScript.

The project was developed with a focus on understanding and implementing real-world backend concepts such as authentication, API design, database persistence, security, and deployment.

---

## ✨ Key Features

* 🔐 **JWT-based authentication** for secure user sessions
* 👤 **User registration and login**
* 🔑 **BCrypt password encryption**
* 👨‍💻 **Developer management** with CRUD operations
* 🔍 **Developer search**
* 🌐 **RESTful API architecture**
* 🛡️ **Spring Security-protected endpoints**
* ⚡ **Stateless authentication** using JWT tokens
* 💾 **MySQL database persistence**
* 📖 **Swagger/OpenAPI API documentation**
* 🐳 **Docker support**
* ☁️ **Cloud deployment using Render and Aiven**

---

## 🏗️ Architecture

DevTrack follows a layered Spring Boot architecture:

```text
                    ┌──────────────────────┐
                    │     Web Browser      │
                    │ HTML / CSS / JS      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Spring Boot API    │
                    │      Controllers     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Service Layer   │
                    │   Business Logic     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Repository Layer  │
                    │   Spring Data JPA    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      MySQL Database  │
                    │        Aiven         │
                    └──────────────────────┘

                         Authentication
                               │
                               ▼
                      Spring Security + JWT
```

---

## 🔐 Authentication & Security

DevTrack uses **Spring Security with JWT-based authentication** to protect application endpoints.

### Authentication Flow

```text
User
 │
 ├── Register ──► Password encrypted using BCrypt
 │
 └── Login ─────► Credentials validated
                       │
                       ▼
                  JWT generated
                       │
                       ▼
              Client sends JWT
                       │
                       ▼
             Spring Security validates
                       │
                       ▼
               Protected API access
```

### Authentication Endpoints

```http
POST /auth/register
POST /auth/login
```

After successful login, the server returns a JWT token.

Protected requests include the token using:

```http
Authorization: Bearer <your_token>
```

This approach keeps authentication **stateless** and avoids storing plaintext passwords.

---

## 🛠️ Tech Stack

### Backend

* **Java 21**
* **Spring Boot**
* **Spring Security**
* **Spring Data JPA**
* **Hibernate**
* **JWT / JJWT**
* **Maven**

### Frontend

* **HTML5**
* **CSS3**
* **Vanilla JavaScript (ES6)**

### Database

* **MySQL**
* **Aiven**

### API & Development

* **REST APIs**
* **Swagger / OpenAPI**

### Deployment & Tools

* **Docker**
* **Render**
* **Git**
* **GitHub**
* **IntelliJ IDEA**

---

## ☁️ Deployment

DevTrack is deployed as a cloud-hosted application.

| Component        | Platform        |
| ---------------- | --------------- |
| Application      | **Render**      |
| Database         | **Aiven MySQL** |
| Containerization | **Docker**      |
| Source Control   | **GitHub**      |

The application connects to the hosted MySQL database through environment-based configuration, keeping credentials and deployment-specific settings outside the source code.

---


The API documentation allows developers to explore available endpoints and test API requests directly from the browser.

---

## 📂 Project Structure

```text
DevTrack/
├── src/
│   └── main/
│       ├── java/
│       │   └── com.codewithdivya/
│       │       ├── config/
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── entity/
│       │       ├── repository/
│       │       ├── security/
│       │       └── service/
│       │
│       └── resources/
│           ├── static/
│           └── application.properties
│
├── Dockerfile
├── pom.xml
└── README.md
```

### Layer Responsibilities

| Layer        | Responsibility                             |
| ------------ | ------------------------------------------ |
| `controller` | Handles HTTP requests and API endpoints    |
| `service`    | Contains application/business logic        |
| `repository` | Handles database operations using JPA      |
| `entity`     | Represents persistent database entities    |
| `dto`        | Transfers structured request/response data |
| `security`   | Handles authentication and JWT security    |
| `config`     | Application and security configuration     |
| `static`     | Frontend HTML, CSS, and JavaScript         |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Java 21
* Maven
* MySQL
* Git

Docker can also be used to run the application in a containerized environment.

### 1. Clone the Repository

```bash
git clone https://github.com/divyaallam191-arch/DevTrack.git
```

### 2. Navigate to the Project

```bash
cd DevTrack
```

### 3. Configure Environment Variables

Configure the following environment variables before starting the application:

| Variable         | Description                     |
| ---------------- | ------------------------------- |
| `DB_URL`         | MySQL database connection URL   |
| `DB_USERNAME`    | MySQL database username         |
| `DB_PASSWORD`    | MySQL database password         |
| `JWT_SECRET`     | Secret key used for JWT signing |
| `JWT_EXPIRATION` | JWT token expiration time       |

> **Security:** Never commit database credentials or JWT secrets to GitHub.

### 4. Run the Application

Using Maven:

```bash
mvn spring-boot:run
```

The application will start on:

```text
http://localhost:8080
```

---

## 🐳 Running with Docker

Build the Docker image:

```bash
docker build -t devtrack .
```

Run the container:

```bash
docker run -p 8080:8080 devtrack
```

The application will then be available at:

```text
http://localhost:8080
```

---


### 📖 API Documentation

**Swagger UI:**

```text
http://localhost:8080/swagger-ui/index.html
```

---

## 💡 What This Project Demonstrates

DevTrack was built to gain practical experience with backend and full-stack application development.

### Backend Engineering

* Designing RESTful APIs with Spring Boot
* Implementing layered application architecture
* Building CRUD operations
* Database persistence with JPA/Hibernate

### Security

* Implementing Spring Security
* JWT-based authentication
* BCrypt password hashing
* Stateless authentication
* Protecting API endpoints

### Database

* MySQL database integration
* Entity mapping with Hibernate
* Repository-based data access

### Deployment

* Containerizing applications with Docker
* Deploying a Spring Boot application to Render
* Connecting a cloud-hosted application to an Aiven MySQL database
* Managing configuration through environment variables

---

## 🔮 Future Enhancements

Potential improvements for future versions include:

* Role-based authorization
* Profile image uploads
* Email verification
* Password reset functionality
* Docker Compose support
* GitHub Actions CI/CD pipeline
* Additional developer filtering and management features

---

## 👩‍💻 Author

**Divya Allam**

* GitHub: https://github.com/divyaallam191-arch

---

## ⭐ Support

If you found DevTrack useful or interesting, consider giving the repository a ⭐ on GitHub.

---
