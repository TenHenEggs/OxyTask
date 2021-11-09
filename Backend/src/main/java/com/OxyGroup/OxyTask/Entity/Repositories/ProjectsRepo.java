package com.OxyGroup.OxyTask.Entity.Repositories;

import com.OxyGroup.OxyTask.Entity.Project;
import org.springframework.data.repository.CrudRepository;

public interface ProjectsRepo extends CrudRepository<Project, Long> {
}
