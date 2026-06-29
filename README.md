# 🚀 DevTrack

A Full-Stack Developer Management Platform built using **Spring Boot**, **Spring Security**, **JWT Authentication**, **MySQL**, and **Vanilla JavaScript**.

## 📌 Overview

DevTrack is a secure web application for managing software developers. It provides authentication using JWT and supports CRUD operations on developer records through a responsive web interface.

---

## ✨ Features

- 🔐 Secure JWT Authentication
- 👤 User Registration & Login
- 🔑 Password Encryption using BCrypt
- 👨‍💻 Add Developers
- ✏️ Update Developer Details
- 🗑 Delete Developers
- 🔍 Search Developers
- 📊 RESTful API
- 📄 Swagger API Documentation
- 💾 MySQL Database Integration

---

## 🛠️ Tech Stack

### Backend
- Java 26
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT (JJWT)
- Maven

### Frontend
- HTML5
- CSS3
- JavaScript (ES6)

### Database
- MySQL

### Tools
- IntelliJ IDEA Ultimate
- Docker
- Git
- GitHub
- Postman / IntelliJ HTTP Client

---

## 📂 Project Structure

```
src
├── main
│   ├── java
│   │   └── com.codewithdivya
│   │       ├── config
│   │       ├── controller
│   │       ├── dto
│   │       ├── entity
│   │       ├── repository
│   │       ├── security
│   │       └── service
│   └── resources
│       ├── static
│       └── application.properties
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/DevTrack.git
```

### 2. Navigate to the project

```bash
cd DevTrack
```

### 3. Configure Environment Variables

Create the following environment variables:

| Variable | Description |
|----------|-------------|
| DB_URL | MySQL Database URL |
| DB_USERNAME | Database Username |
| DB_PASSWORD | Database Password |
| JWT_SECRET | JWT Secret Key |
| JWT_EXPIRATION | Token Expiration Time |

---

### 4. Run the project

```bash
mvn spring-boot:run
```

---

## 📖 API Documentation

After starting the application, open:

```
http://localhost:8080/swagger-ui.html
```

---

## 🔐 Authentication

DevTrack uses **JWT Authentication**.

### Register

```
POST /auth/register
```

### Login

```
POST /auth/login
```

After login, the API returns a JWT token.

Include it in protected requests:

```
Authorization: Bearer <your_token>
```

---

## 📸 Screenshots

### Login Page

*(Add screenshot here after deployment)*

### Dashboard

*(Add screenshot here after deployment)*

### Swagger API

*(Add screenshot here after deployment)*

---

## 🌐 Live Demo

🚧 Coming Soon (Railway Deployment)

---

## 🔮 Future Enhancements

- Role-based Authorization (Admin/User)
- Pagination & Sorting
- File Upload for Profile Images
- Email Verification
- Password Reset
- Docker Compose Deployment
- CI/CD using GitHub Actions

---

## 👩‍💻 Author

**Divya Allam**

GitHub: https://github.com/YOUR_GITHUB_USERNAME

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!