package com.OxyGroup.OxyTask;

import com.OxyGroup.OxyTask.Entity.Repositories.ProjectsRepo;
import com.OxyGroup.OxyTask.Entity.Project;
import com.OxyGroup.OxyTask.Entity.Repositories.TagRepo;
import com.OxyGroup.OxyTask.Entity.Repositories.TaskRepo;
import com.OxyGroup.OxyTask.Entity.Tag;
import com.OxyGroup.OxyTask.Entity.Task;

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

    @Autowired
    private TagRepo tagRepo;

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

    @GetMapping(value = "/tables/{projectId}/tags/")
    public  Result<Set<Tag>> getProjectTags(@PathVariable long projectId){
        return new Result<>(true).withData(projectsRepo.findById(projectId).get().allTags());
    }
    //-----------------------------------------------//
    //               POST MAPPING                    //
    //-----------------------------------------------//


    @PostMapping(value = "/tables")
    public Result<Long> createProject(@RequestBody Project newProject){

        Pattern pattern = Pattern.compile("[#%&*:<>?|/]");
        Matcher matcher = pattern.matcher(newProject.getName());

        if (matcher.find())
            return new Result<Long>(false).withError("name is not allowed");

        projectsRepo.save(newProject);
        return new Result<Long>(true).withData(newProject.getId());
    }

    @PostMapping(value = "/tables/{projectId}/tasks")
    public Result<Task> createTask(@PathVariable long projectId, @RequestBody Task newTask) {


      newTask.setProject(projectsRepo.findById(projectId).get());
      taskRepo.save(newTask);

      return new Result<>(true).withData(newTask);
    }
    @PostMapping(value = "/tables/{projectId}/tags/")
    public Result<Long> createTag(@PathVariable long projectId, @RequestBody Tag newTag){



        newTag.setProject(projectsRepo.findById(projectId).get());
        tagRepo.save(newTag);

        return new Result<>(true).withData(newTag.getId());
    }

    //-----------------------------------------------//
    //               DELETE MAPPING                  //
    //-----------------------------------------------//

    @DeleteMapping(value = "//tables/{tableId}/tags/{tagId} ")
    public Result<String> deleteTag(@PathVariable long tagId){
        tagRepo.deleteById(tagId);
        return new Result<>(true);
    }

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

    //-----------------------------------------------//
    //               PATCH MAPPING                   //
    //-----------------------------------------------//

    @PatchMapping(value = " /tables/{TableId}/tasks/{TaskId}")
    public Result<String> pushTask(@RequestBody long list, @PathVariable long TaskId){
        Task task = taskRepo.findById(TaskId).get();
        task.setList(list);
        taskRepo.save(task);
        return new Result<>(true);
    }

    //-----------------------------------------------//
    //               PUT MAPPING                     //
    //-----------------------------------------------//

    @PutMapping(value = "/tables/{TableId}/tasks/{TaskId}")
    public Result<String> updateTask(@RequestBody Task updateTask, @PathVariable long TaskId){
        Task task = taskRepo.findById(TaskId).get();
        task = updateTask;
        taskRepo.save(task);
        return new Result<>(true);
    }
}
