package com.OxyGroup.OxyTask.Entity;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;

@Entity
@Getter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column
    private String Login;
    @Column @Setter
    private String email;
    @Column @Setter
    private String salt;
    @Column @Setter
    private String passwordHash;

}
