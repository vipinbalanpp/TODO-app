package com.vipin.todo.app.backend.controller;
import com.vipin.todo.app.backend.model.dto.ProjectDto;
import com.vipin.todo.app.backend.service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/projects")
public class ProjectController {
    private final ProjectService projectService;
    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto projectDto,
                                                    HttpServletRequest request){
        System.out.println(projectDto.getTitle());
       ProjectDto response =  projectService.createProject(projectDto,request);
       return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects(HttpServletRequest request){
        return ResponseEntity.ok(projectService.getAllProjects(request));
    }
    @GetMapping("/{title}")
    public ResponseEntity<ProjectDto> getProjectDetails(@PathVariable String title,
                                                        HttpServletRequest request){
        ProjectDto projectDto = projectService.getProductDetails(title,request);
        return new ResponseEntity<>(projectDto,HttpStatus.OK);
    }
    @PutMapping("/{title}")
    public ResponseEntity<ProjectDto> editProjectName (@PathVariable String title,
                                                       @RequestParam String newTitle,
                                                       HttpServletRequest request){
        return ResponseEntity.ok(projectService.editProjectName(title,newTitle,request));
    }
}
