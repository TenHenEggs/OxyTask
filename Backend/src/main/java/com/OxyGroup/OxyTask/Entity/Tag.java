package com.OxyGroup.OxyTask.Entity;

import lombok.Getter;

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
}
