package com.OxyGroup.OxyTask.Entity;

import javax.persistence.*;

@Entity
public class Tables {
    @Id
    @GeneratedValue
    private Long id;
    @Column
    @Lob
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
