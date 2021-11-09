package com.OxyGroup.OxyTask.Entity;

import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
public class SubTask {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
}
