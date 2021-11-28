package com.OxyGroup.OxyTask.Entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "tags")

public class Tag {

    @Getter @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Getter @Column
    private int Color;
    @Getter @Column
    private String name;
    @ManyToMany
    private Set<Task> tasks;
    @Setter @ManyToOne @JoinColumn(name = "project_id")
    private Project project;
}
