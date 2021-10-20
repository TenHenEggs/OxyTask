package com.OxyGroup.OxyTask;

import com.OxyGroup.OxyTask.Entity.Repositories.TablesRepo;
import com.OxyGroup.OxyTask.Entity.Tables;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api")
public class WebController {
    @Autowired
    private TablesRepo tablesRepo;
    private ObjectMapper JSONMapper = new ObjectMapper();

    @RequestMapping(value = "/tables", method = RequestMethod.GET)
    @ResponseBody
    public String getTables() throws JsonProcessingException {
        var allTables = tablesRepo.findAll();
        return JSONMapper.writerWithDefaultPrettyPrinter().writeValueAsString(allTables);
    }

    @RequestMapping(value = "/tables/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public String delTables(@PathVariable long id) throws JsonProcessingException {
        tablesRepo.deleteById(id);
        return "{}";
    }

    @RequestMapping(value = "/tables", method =  RequestMethod.POST)
    @ResponseBody
    public String createTables(@RequestBody String data) throws JsonProcessingException {
        Tables newTables = JSONMapper.readValue(data, Tables.class); //JSON to Tables class
        tablesRepo.save(newTables);
        return new StringBuilder("{\"id\":").append(newTables.getId()).append("}").toString();
    }
}
