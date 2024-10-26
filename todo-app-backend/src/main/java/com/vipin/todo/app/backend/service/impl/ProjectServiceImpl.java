package com.vipin.todo.app.backend.service.impl;

import com.vipin.todo.app.backend.model.dto.ProjectDto;
import com.vipin.todo.app.backend.model.dto.TodoDto;
import com.vipin.todo.app.backend.model.entity.Project;
import com.vipin.todo.app.backend.model.entity.Status;
import com.vipin.todo.app.backend.model.entity.Todo;
import com.vipin.todo.app.backend.repository.ProjectRepository;
import com.vipin.todo.app.backend.repository.TodoRepository;
import com.vipin.todo.app.backend.service.AuthenticationService;
import com.vipin.todo.app.backend.service.ProjectService;
import com.vipin.todo.app.backend.service.TodoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final AuthenticationService authenticationService;
    private final TodoService todoService;
    private final TodoRepository todoRepository;
    @Override
    public ProjectDto createProject(ProjectDto projectDto, HttpServletRequest request) {
        Long userId = authenticationService.getUserIdFromToken(request);
        if (userId == null) {
            throw new RuntimeException("Error getting user id from request");
        }
        Project project = Project
                .builder()
                .title(projectDto.getTitle())
                .createdAt(LocalDateTime.now())
                .userId(userId)
                .build();
        projectRepository.save(project);
        List<Todo> todos = new ArrayList<>();
        for (TodoDto todoDto : projectDto.getTodos()) {
            Todo todo = Todo
                    .builder()
                    .description(todoDto.getDescription())
                    .status(Status.PENDING)
                    .createdAt(LocalDateTime.now())
                    .project(project)
                    .build();
            todoRepository.save(todo);
            todos.add(todo);
        }
        project.setTodos(todos);
        projectRepository.save(project);
        return mapProjectToDto(project);
    }


    @Override
    public List<ProjectDto> getAllProjects(HttpServletRequest request) {
        Long userId = authenticationService.getUserIdFromToken(request);
        if(userId == null){
            throw  new RuntimeException("an error occurred");
        }
        List<Project> projects = projectRepository.findByUserId(userId);
        List<ProjectDto> projectDtos = new ArrayList<>();
        for(Project project:projects){
            projectDtos.add(mapProjectToDto(project));
        }
        return projectDtos;
    }

    @Override
    public ProjectDto getProductDetails(String title, HttpServletRequest request) {
        Long userId = authenticationService.getUserIdFromToken(request);
        if(userId == null){
            throw new RuntimeException("An error occurred while getting details of project");
        }
        Project project = projectRepository.findByTitleAndUserId(title,userId);
        return mapProjectToDto(project);
    }

    @Override
    public ProjectDto editProjectName(String title, String newTitle,HttpServletRequest request) {
        Long userId = authenticationService.getUserIdFromToken(request);
        if(projectRepository.existsByTitleAndUserId(newTitle,userId)){
            throw new RuntimeException("You already have a project with this name");
        }
        Project project = projectRepository.findByTitleAndUserId(title,userId);
        project.setTitle(newTitle);
        projectRepository.save(project);
        return mapProjectToDto(project);
    }

    public ProjectDto mapProjectToDto(Project project){
        List<TodoDto> todoDtos = new ArrayList<>();
        for(Todo todo:project.getTodos()){
            TodoDto todoDto = new TodoDto(todo);
            todoDtos.add(todoDto);
        }
        return ProjectDto
                .builder()
                .id(project.getId())
                .title(project.getTitle())
                .createdAt(project.getCreatedAt())
                .userId(project.getUserId())
                .todos(todoDtos)
                .build();
    }
}
