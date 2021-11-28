package com.OxyGroup.OxyTask.Entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "tasks")
public class Task {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Getter
    private long id;

    @Column @Setter @Getter
    private String name;

    @Column @Lob @Setter @Getter
    private String description;

    @Column @Setter @Getter
    private String deadline;

   @Setter @ManyToOne @JoinColumn(name = "project_id")
    private Project project;

   @Column @Setter
    private long list;

   @Setter @ManyToMany
   @JoinTable(
           name = "tags_tasks",
           joinColumns = {@JoinColumn(name = "tags_id")},
           inverseJoinColumns = {@JoinColumn(name = "tasks_id")}
   )
    private Set<Tag> tags;

   public Set<Tag> allTags(){return tags;}
}
