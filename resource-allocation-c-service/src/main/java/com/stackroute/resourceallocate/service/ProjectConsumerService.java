package com.stackroute.resourceallocate.service;

import com.stackroute.resourceallocate.convertor.Converter;
import com.stackroute.resourceallocate.dto.ProjectDTO;
import com.stackroute.resourceallocate.model.Project;
import com.stackroute.resourceallocate.repository.ProjectRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.annotation.RabbitListenerConfigurer;
import org.springframework.amqp.rabbit.listener.RabbitListenerEndpointRegistrar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectConsumerService implements RabbitListenerConfigurer
{
    private ProjectRepository projectRepository;

    private Converter converter=new Converter();

    @Autowired
    public ProjectConsumerService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @RabbitListener(queues = "${spring.rabbitmq.projectAllocateQueue}")
    public void receieveMessage(ProjectDTO projectDTO)
    {
        if(projectDTO.getAction().equals("create"))
        {
            addProjectFromQueue(projectDTO);
        }
        if(projectDTO.getAction().equals("update"))
        {
            updateProjectFromQueue(projectDTO);
        }
    }

    private void addProjectFromQueue(ProjectDTO projectDTO)
    {
        Project newProject=converter.projectDtoToProject(projectDTO);
        projectRepository.save(newProject);
    }

    private void updateProjectFromQueue(ProjectDTO projectDTO)
    {
        Project updatedProject= converter.projectDtoToProject(projectDTO);
        projectRepository.save(updatedProject);
    }

    @Override
    public void configureRabbitListeners(RabbitListenerEndpointRegistrar rabbitListenerEndpointRegistrar) {

    }
}
