package com.vipin.todo.app.backend.model.dto;

import com.vipin.todo.app.backend.model.entity.Status;
import com.vipin.todo.app.backend.model.entity.Todo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TodoDto {
    private Long id;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public TodoDto(Todo todo){
        this.id = todo.getId();
        this.description = todo.getDescription();
        this.status = todo.getStatus().name();
        this.createdAt = todo.getCreatedAt();
        this.updatedAt = todo.getUpdatedAt();
    }
}
