package com.OxyGroup.OxyTask.Entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity

public class Tables {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter
    @Column(name = "id")
    private Long id;
    @Column
    @Lob @Getter @Setter
    private String name;
}
