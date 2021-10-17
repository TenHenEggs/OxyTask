package com.OxyGroup.OxyTask.Entity;

import javax.persistence.*;

@Entity
public class List {
    @Id
    @GeneratedValue
    private long id;
    @Column
    @Lob
    private String name;
}
