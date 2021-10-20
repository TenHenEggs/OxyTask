package com.OxyGroup.OxyTask.Entity;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy =  GenerationType.AUTO)
    @Getter
    private long id;
    @Column
    private String Login;
    @Column
    @Lob @Getter @Setter
    private String email;
    @Column
    @Lob @Getter @Setter
    private String salt;
    @Column
    @Lob @Getter @Setter
    private String passwordHash;

}
