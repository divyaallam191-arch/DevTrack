package com.codewithdivya.exception;

public class ApiResponse<T> {
    private String status;
    private String message;
    private T data;

    // Constructor
    public ApiResponse(String status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    // Getters
    public String getStatus() { return status; }
    public String getMessage() { return message; }
    public T getData() { return data; }
}
