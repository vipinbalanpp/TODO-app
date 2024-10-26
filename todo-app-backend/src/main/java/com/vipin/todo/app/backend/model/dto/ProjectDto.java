package com.vipin.todo.app.backend.model.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjectDto {
    private Long id;
    private String title;
    private Long userId;
    private LocalDateTime createdAt;
    private List<TodoDto> todos;
}
