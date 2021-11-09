package com.OxyGroup.OxyTask;

import com.OxyGroup.OxyTask.Entity.Repositories.ProjectsRepo;
import com.OxyGroup.OxyTask.Entity.Project;
import com.OxyGroup.OxyTask.Entity.Repositories.TaskRepo;
import com.OxyGroup.OxyTask.Entity.Task;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping(value = "/api")
public class WebController {
    @Autowired
    private ProjectsRepo projectsRepo;

    @Autowired
    private TaskRepo taskRepo;

    private ObjectMapper JSONMapper = new ObjectMapper();

    //-----------------------------------------------//
    //               GET MAPPING                     //
    //-----------------------------------------------//

    @GetMapping(value = "/tables")
    public Result<Iterable<Project>> getProjects() {
        return new Result<>(true).withData(projectsRepo.findAll());
    }

    @GetMapping(value = "/tables/{projectId}/tasks")
    public Result<Set<Task>> getProjectTasks(@PathVariable long projectId){
        return new Result<>(true).withData(projectsRepo.findById(projectId).get().allTasks());
    }

    //-----------------------------------------------//
    //               POST MAPPING                    //
    //-----------------------------------------------//


    @PostMapping(value = "/tables")
    public Result<Long> createProject(@RequestBody String data) throws JsonProcessingException {
        Project newProject = JSONMapper.readValue(data, Project.class); //JSON to Tables class


        Pattern pattern = Pattern.compile("[#%&*:<>?|/]");
        Matcher matcher = pattern.matcher(newProject.getName());

        if (matcher.find())
            return new Result<Long>(false).withError("name is not allowed");

        projectsRepo.save(newProject);
        return new Result<Long>(true).withData(newProject.getId());
    }

    @PostMapping(value = "/tables/{projectId}/tasks")
    public Result<Task> createTask(@PathVariable long projectId, @RequestBody String data) throws JsonProcessingException {

      Task newTask = JSONMapper.readValue(data, Task.class);

      newTask.setProject(projectsRepo.findById(projectId).get());
      taskRepo.save(newTask);

      return new Result<>(true).withData(newTask);
    }

    //-----------------------------------------------//
    //               DELETE MAPPING                  //
    //-----------------------------------------------//


    @DeleteMapping(value ="/tables/{id}")
    public Result<String> deleteProject(@PathVariable long id) {
        projectsRepo.deleteById(id);
        return new Result<>(true);
    }

    @DeleteMapping(value = "/tables/{projectId}/tasks/{taskId}")
    public Result<String> deleteTask(@PathVariable long taskId){
        taskRepo.deleteById(taskId);
        return new Result<>(true);
    }
}
