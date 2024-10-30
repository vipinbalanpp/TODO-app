package com.vipin.todo.app.backend.exceptions;


public class TodoNotFoundException extends RuntimeException{
    public TodoNotFoundException(String message){
        super(message);
    }
}
