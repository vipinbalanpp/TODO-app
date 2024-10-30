package com.vipin.todo.app.backend.controller;
import com.vipin.todo.app.backend.model.dto.TodoDto;
import com.vipin.todo.app.backend.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/todos")
public class TodoController {
    private final TodoService todoService;

    @PostMapping
    public ResponseEntity<TodoDto> addTodo(@RequestParam Long projectId,
                                           @RequestBody TodoDto todoDto){
        return new ResponseEntity<>(todoService.createTodo(projectId,todoDto),HttpStatus.CREATED);
    }
    @PutMapping
    public ResponseEntity<List<TodoDto>> updateTodo(@RequestBody List<Long> todoIds){
        return ResponseEntity.ok(todoService.updateTodoAsCompleted(todoIds));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable("id") Long todoId){
        System.out.println(todoId);
                todoService.deleteTodoById(todoId);
                return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<TodoDto> editTodoDescription(@PathVariable("id") Long todoId,
                                                       @RequestParam String newDescription){
        return ResponseEntity.ok(todoService.editTodoDescription(todoId,newDescription));
    }
}
