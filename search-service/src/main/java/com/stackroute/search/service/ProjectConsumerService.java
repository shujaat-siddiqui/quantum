package com.stackroute.search.service;

import com.stackroute.search.converter.Converter;
import com.stackroute.search.dto.ProjectDTO;
import com.stackroute.search.model.Project;
import com.stackroute.search.repository.ProjectRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectConsumerService {

    @Autowired
    private ProjectRepository projectRepository;

    Converter converter = new Converter();

    @RabbitListener(queues = "${spring.rabbitmq.projectQueue}")
    public void recivedMessage(ProjectDTO projectDTO) {
        if (projectDTO.getAction().equals("create")) {
            addProjectFromQueue(projectDTO);
        }
        else if (projectDTO.getAction().equals("update")) {
            updateProjectFromQueue(projectDTO);
        }
    }

    public void addProjectFromQueue(ProjectDTO projectDTO) {
        Project newProject = converter.projectDtoToProject(projectDTO);
        projectRepository.save(newProject);
    }

    public void updateProjectFromQueue(ProjectDTO projectDTO) {
        Project updateProject = converter.projectDtoToProject(projectDTO);
        projectRepository.save(updateProject);
    }
}
