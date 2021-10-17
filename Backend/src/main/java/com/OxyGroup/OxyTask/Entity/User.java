package com.OxyGroup.OxyTask.Entity;

import org.springframework.data.repository.CrudRepository;

import javax.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy =  GenerationType.AUTO)
    private long id;
    @Column
    private String Login;
    @Column
    @Lob
    private String email;
    @Column
    @Lob
    private String salt;
    @Column
    @Lob
    private String passwordHash;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }


    public String getLogin() {
        return Login;
    }

    public void setLogin( String login) {
        Login = login;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }


}
