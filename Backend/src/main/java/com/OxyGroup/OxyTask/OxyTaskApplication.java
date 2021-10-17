package com.OxyGroup.OxyTask;

import com.OxyGroup.OxyTask.Entity.Repositories.UserRepo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackageClasses = UserRepo.class)
public class OxyTaskApplication {

	public static void main(String[] args) {
		SpringApplication.run(OxyTaskApplication.class, args);
	}

}
