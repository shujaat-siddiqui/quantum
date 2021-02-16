package com.stackroute.search.service;

import com.stackroute.search.converter.Converter;
import com.stackroute.search.dto.UserDTO;
import com.stackroute.search.model.UserProfile;
import com.stackroute.search.repository.UserProfileRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.annotation.RabbitListenerConfigurer;
import org.springframework.amqp.rabbit.listener.RabbitListenerEndpointRegistrar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserProfileConsumerService implements RabbitListenerConfigurer {

    @Autowired
    private UserProfileRepository userProfileRepository;

    Converter converter = new Converter();

    @RabbitListener(queues = "${spring.rabbitmq.userQueue}")
    public void recivedMessage(UserDTO userDTO) {
        String action = userDTO.getAction();
        if (action.equals("create")) {
            addUserFromQueue(userDTO);
        }
        if(action.equals("update")) {
            updateUserFromQueue(userDTO);
        }
    }

    public void addUserFromQueue(UserDTO userDTO) {
        UserProfile newUserProfile = converter.userDtoToUserProfile(userDTO);
        userProfileRepository.save(newUserProfile);
    }

    public void updateUserFromQueue(UserDTO userDTO) {
        UserProfile updatedUserProfile = converter.userDtoToUserProfile(userDTO);
        userProfileRepository.save(updatedUserProfile);
    }

    @Override
    public void configureRabbitListeners(RabbitListenerEndpointRegistrar rabbitListenerEndpointRegistrar) {

    }
}
