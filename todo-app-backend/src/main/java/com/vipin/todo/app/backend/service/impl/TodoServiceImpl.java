package com.vipin.todo.app.backend.service.impl;
import com.vipin.todo.app.backend.model.dto.TodoDto;
import com.vipin.todo.app.backend.model.entity.Project;
import com.vipin.todo.app.backend.model.entity.Status;
import com.vipin.todo.app.backend.model.entity.Todo;
import com.vipin.todo.app.backend.repository.ProjectRepository;
import com.vipin.todo.app.backend.repository.TodoRepository;
import com.vipin.todo.app.backend.service.AuthenticationService;
import com.vipin.todo.app.backend.service.TodoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {
    private final TodoRepository todoRepository;
    private final AuthenticationService authenticationService;
    private final ProjectRepository projectRepository;



    @Override
    public TodoDto createTodo(Long projectId,TodoDto todoDto) {
        Project project = projectRepository.findById(projectId).orElseThrow(()-> new RuntimeException("Project not found"));
        for(Todo todo : project.getTodos()){
            if(todo.getDescription().equals(todoDto.getDescription())){
                throw new RuntimeException("Task exists with the same description for this project");
            }
        }
        Todo todo = Todo
                .builder()
                .description(todoDto.getDescription())
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .project(project)
                .build();
        todoRepository.save(todo);
        project.getTodos().add(todo);
        projectRepository.save(project);
        return new TodoDto(todo);
    }


}
