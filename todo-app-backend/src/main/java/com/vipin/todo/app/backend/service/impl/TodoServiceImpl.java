package com.vipin.todo.app.backend.service.impl;
import com.vipin.todo.app.backend.exceptions.TodoNotFoundException;
import com.vipin.todo.app.backend.model.dto.TodoDto;
import com.vipin.todo.app.backend.model.entity.Project;
import com.vipin.todo.app.backend.model.entity.Status;
import com.vipin.todo.app.backend.model.entity.Todo;
import com.vipin.todo.app.backend.repository.ProjectRepository;
import com.vipin.todo.app.backend.repository.TodoRepository;
import com.vipin.todo.app.backend.service.AuthenticationService;
import com.vipin.todo.app.backend.service.TodoService;
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

    @Override
    public List<TodoDto> updateTodoAsCompleted(List<Long> todoIds) {
        List<Todo> todos = new ArrayList<>();
        for(Long id:todoIds){
            Todo todo = todoRepository.findById(id).orElseThrow(() ->new RuntimeException("Todo not exists with id: "+id));
            todos.add(todo);
        }
        for(Todo todo:todos){
            todo.setStatus(Status.COMPLETED);
            todo.setUpdatedAt(LocalDateTime.now());
            todoRepository.save(todo);
        }
        List<TodoDto> todoDtos = new ArrayList<>();
        for(Todo todo: todos){
            TodoDto todoDto = new TodoDto(todo);
            todoDtos.add(todoDto);
        }return todoDtos;
    }

    @Override
    public void deleteTodoById(Long todoId) {
        Todo todo = todoRepository.findById(todoId).orElseThrow(()->new TodoNotFoundException("Todo does not exists"));
//        Project project = projectRepository.findById(todo.getProject().getId()).orElseThrow(()->new RuntimeException("Error occurred"));
//        project.getTodos().remove(todo);
//        projectRepository.save(project);
        todoRepository.deleteById(todoId);
    }

    @Override
    public TodoDto editTodoDescription(Long todoId,String newDescription) {
        Todo todo = todoRepository.findById(todoId).orElseThrow(() -> new TodoNotFoundException("Todo not found"));
//        Project project = projectRepository.findById(todo.getProject().ge)
        for(Todo todo1:todo.getProject().getTodos()){
            if (todoId != todo1.getId() && todo1.getDescription().equals(newDescription)){
                throw new RuntimeException("Todo exists with this description");
            }
        }
        todo.setDescription(newDescription);
        todoRepository.save(todo);
        return new TodoDto(todo);
    }


}
