package com.vipin.todo.app.backend.service;

import com.vipin.todo.app.backend.model.dto.ProjectDto;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface ProjectService {
    ProjectDto createProject(ProjectDto projectDto, HttpServletRequest request);

    List<ProjectDto> getAllProjects(HttpServletRequest request);

    ProjectDto getProductDetails(String title, HttpServletRequest request);

    ProjectDto editProjectName(String title, String newTitle,HttpServletRequest request);
}
