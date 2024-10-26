package com.vipin.todo.app.backend.service;

import com.vipin.todo.app.backend.model.dto.TodoDto;
import com.vipin.todo.app.backend.model.entity.Todo;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface TodoService {


    TodoDto createTodo(Long projectId,TodoDto todoDto);
}
