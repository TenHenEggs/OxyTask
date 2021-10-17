package com.OxyGroup.OxyTask.Entity.Repositories;

import com.OxyGroup.OxyTask.Entity.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepo extends CrudRepository<User, Long> {
}
