package com.vipin.todo.app.backend.controller;
import com.vipin.todo.app.backend.exceptions.TodoNotFoundException;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity handleIllegalArgumentException(IllegalArgumentException illegalArgumentException){
        return ResponseEntity.badRequest().body(illegalArgumentException.getMessage());
    }
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity handleEntityNotFoundException(EntityNotFoundException entityNotFoundException){
        return ResponseEntity.badRequest().body(entityNotFoundException.getMessage());
    }
    @ExceptionHandler(EntityExistsException.class)
    public ResponseEntity handleEntityExistsException(EntityExistsException entityExistsException){
        return ResponseEntity.badRequest().body(entityExistsException.getMessage());
    }
    @ExceptionHandler(TodoNotFoundException.class)
    public ResponseEntity handleTodoNotFoundException(TodoNotFoundException todoNotFoundException){
        return ResponseEntity.badRequest().body(todoNotFoundException.getMessage());
    }
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity handleRuntimeException(RuntimeException runtimeException){
        return ResponseEntity.badRequest().body(runtimeException.getMessage());
    }


}
