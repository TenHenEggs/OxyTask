package com.OxyGroup.OxyTask.Entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity

public class Project {


    @Getter @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column @Setter @Getter
    private String name;

    @OneToMany(mappedBy = "project")
    private Set<Task> tasks;

    @OneToMany(mappedBy = "project")
    private  Set<Tag> tags;

    public Set<Task> allTasks(){
        return tasks;
    }

    public Set<Tag> allTags(){ return  tags;}
}
