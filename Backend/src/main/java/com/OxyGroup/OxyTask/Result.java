package com.OxyGroup.OxyTask;

import lombok.Data;

@Data
public class Result <T>{
private boolean success;
private T data;
private String error;
    public Result(boolean success) {
        this.success = success;
    }

    public Result withError(String error){
        this.error = error;
        return this;
    }

    public Result withData(T data){
        this.data = data;
        return this;
    }

}
