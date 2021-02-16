package com.stackroute.allocationengine.service;

import com.stackroute.allocationengine.dto.ProjectDTO;
import com.stackroute.allocationengine.dto.ProjectRecommendationResponse;
import com.stackroute.allocationengine.dto.User;
import com.stackroute.allocationengine.enums.SkillLevel;
import com.stackroute.allocationengine.exception.ResourcesNotSufficientException;
import com.stackroute.allocationengine.model.Expertise;
import com.stackroute.allocationengine.model.Skill;
import com.stackroute.allocationengine.model.UserProfile;
import com.stackroute.allocationengine.repository.QueryRepository;
import com.stackroute.allocationengine.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    QueryRepository queryRepository;

    @Override
    public UserProfile getUser(String email) {
        return userProfileRepository.findById(email).get();
    }

    @Override
    public List<ProjectRecommendationResponse> getRecommendedUsers(ProjectDTO projectDTO) throws ResourcesNotSufficientException {

        List<ProjectRecommendationResponse> toReturn = new ArrayList<>();
        final String location = projectDTO.getLocation();

        for (Expertise expertise: projectDTO.getExpertise()) {

            ProjectRecommendationResponse response = new ProjectRecommendationResponse();
            response.setDesignation(expertise.getDesignation());

            System.out.println(expertise.getDomainExperience());

            List<UserProfile> userProfiles = userProfileRepository.getRelatedUsers(location, expertise.getMinExperienceNeeded(), expertise.getMaxExperienceNeeded(), expertise.getDesignation(), expertise.getDomainExperience());
            System.out.println("Before Skill Filtering: "+expertise.getDesignation()+" - "+userProfiles.size());

            List<UserProfile> filteredUserProfiles = matchSkills(userProfiles, expertise.getSkills());
            System.out.println("After Skill Filtering: "+expertise.getDesignation()+" - "+filteredUserProfiles.size());

            if (filteredUserProfiles.size() >= (expertise.getNoOfResources() * 3)) {
                response.setResourcesSuggested(
                        convertUserProfileListToUserList(limitNoOfResources(filteredUserProfiles, expertise.getNoOfResources() * 3), expertise.getDesignation())
                );
            }
            else {
                throw new ResourcesNotSufficientException("Not Enough Resources");
//                response.setResourcesSuggested(convertUserProfileListToUserList(filteredUserProfiles, expertise.getDesignation()));
            }
            response.setNoOfResources(response.getResourcesSuggested().size());
            System.out.println("Sending: "+response.getNoOfResources()+" resources");
            toReturn.add(response);
        }
        return toReturn;
    }

    private List<UserProfile> matchSkills(List<UserProfile> userProfiles, List<Skill> skills) {

        List<UserProfile> userProfileList = new ArrayList<>();

        for (UserProfile userProfile: userProfiles) {

            List<Boolean> skillCheckList = new ArrayList<>();

            for (Skill requiredSkill: skills) {
                if (requiredSkill.getLevel().toString().equals("BASIC")) {
                    if ( queryRepository.getUserWithRequiredSkillAndLevel(
                            userProfile.getEmail(), requiredSkill.getSkillName(), Arrays.asList("BASIC", "INTERMEDIATE", "ADVANCE")) != null )
                        skillCheckList.add(true);
                    else
                        skillCheckList.add(false);
                }
                else if (requiredSkill.getLevel().toString().equals("INTERMEDIATE")) {
                    if ( queryRepository.getUserWithRequiredSkillAndLevel(
                            userProfile.getEmail(), requiredSkill.getSkillName(), Arrays.asList("INTERMEDIATE", "ADVANCE")) != null )
                        skillCheckList.add(true);
                    else
                        skillCheckList.add(false);
                }
                else if (requiredSkill.getLevel().toString().equals("ADVANCE")) {
                    if ( queryRepository.getUserWithRequiredSkillAndLevel(
                            userProfile.getEmail(), requiredSkill.getSkillName(), Arrays.asList("ADVANCE")) != null )
                        skillCheckList.add(true);
                    else
                        skillCheckList.add(false);
                }
            }

            if (! skillCheckList.contains(false))
                userProfileList.add(userProfile);
        }

        return userProfileList;
    }

    private List<Skill> convertMapListToSkillList(List<Map<String, SkillLevel>> skillsList) {
        List<Skill> skills = new ArrayList<>();
        for (Map<String, SkillLevel> skill: skillsList) {
            skills.add(new Skill(skill.values().toArray()[0].toString(), SkillLevel.valueOf(skill.values().toArray()[1].toString())));
        }
        return skills;
    }

    private List<UserProfile> limitNoOfResources(List<UserProfile> userProfiles, int totalItems) {

        Random rand = new Random();
        List<UserProfile> userProfileList = new ArrayList<>();

        for (int i = 0; i < totalItems; i++) {
            int randomIndex = rand.nextInt(userProfiles.size());
            userProfileList.add(userProfiles.get(randomIndex));
            userProfiles.remove(randomIndex);
        }

        return userProfileList;
    }

    private List<User> convertUserProfileListToUserList(List<UserProfile> userProfileList, String designation) {
        List<User> users = new ArrayList<>();
        for (UserProfile userProfile: userProfileList) {
            users.add(new User(userProfile.getEmail(), userProfile.getName(), designation));
        }
        return users;
    }

}
