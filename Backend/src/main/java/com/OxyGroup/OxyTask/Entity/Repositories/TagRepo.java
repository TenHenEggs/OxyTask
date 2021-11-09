package com.OxyGroup.OxyTask.Entity.Repositories;

import com.OxyGroup.OxyTask.Entity.Tag;
import org.springframework.data.repository.CrudRepository;

public interface TagRepo  extends CrudRepository<Tag, Long> {
}
