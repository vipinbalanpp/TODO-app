package com.vipin.todo.app.backend.repository;

import com.vipin.todo.app.backend.model.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project,Long> {
    List<Project> findByUserId(Long userId);
    Project findByTitleAndUserId(String title,Long userId);

    boolean existsByTitleAndUserId(String title, Long userId);
}
