package com.OxyGroup.OxyTask;

import com.OxyGroup.OxyTask.Entity.Repositories.TablesRepo;
import com.OxyGroup.OxyTask.Entity.Repositories.UserRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DataBaseClient {
    @Autowired
    private TablesRepo tablesRepo;

    private ObjectMapper JSONMapper = new ObjectMapper();
    @RequestMapping("/api/tables")
    @ResponseBody
    public String getTables() throws JsonProcessingException {
        var allTables = tablesRepo.findAll();
        return JSONMapper.writerWithDefaultPrettyPrinter().writeValueAsString(allTables);
    }
}
