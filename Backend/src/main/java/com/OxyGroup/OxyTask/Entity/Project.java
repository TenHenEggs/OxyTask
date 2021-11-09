package com.OxyGroup.OxyTask.Entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Getter
public class Project {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column @Setter
    private String name;

   @OneToMany(mappedBy = "project")
    private Set<Task> tasks;

   public Set<Task> allTasks(){
       return tasks;
   }
}
