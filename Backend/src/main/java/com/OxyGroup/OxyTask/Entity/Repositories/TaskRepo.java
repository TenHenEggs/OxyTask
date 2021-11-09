package com.OxyGroup.OxyTask.Entity.Repositories;

import com.OxyGroup.OxyTask.Entity.Task;
import org.springframework.data.repository.CrudRepository;

public interface TaskRepo extends CrudRepository<Task, Long> {
}
