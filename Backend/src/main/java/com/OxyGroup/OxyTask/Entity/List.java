package com.OxyGroup.OxyTask.Entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity @Getter
public class List {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column @Setter
    private String name;
}
