package com.stackroute.resourceallocate.repository;

import com.stackroute.resourceallocate.model.UserProfile;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface UserProfileRepository extends Neo4jRepository<UserProfile,String>
{
    UserProfile findByName(String name);

    @Query("MATCH (u:UserProfile) where u.email=$email with u \n" +
            "MATCH (c:CTC) where c.name=$ctc \n" +
            "MERGE (u)-[:HAS_CTC]->(c) with u \n" +
            "MATCH (l:City) where l.name=$location \n" +
            "MERGE (u)-[:LOCATED_IN]->(l) with u \n" +
            "MATCH (d:Designation) Where d.name=$designation \n" +
            "MERGE (u)-[:WORKS_IN]->(d)")
    public void createRelationBetweenUserProfileAndOtherNodes
            (String email, Float ctc,String location,String designation);

    @Query("Match(u:UserProfile)where u.email=$email with u \n" +
            "MATCH(t:TechnicalSkills) WHERE t.name=$skillName  \n " +
            "MERGE (u)-[:HAS_SKILL{level: $level }]->(t) ")
    public void createRelationUserAndTechnicalSkill(String email,String skillName, String level);

    @Query("MATCH (u:UserProfile) where u.email=$email with u \n" +
            "MATCH(pd:ProfessionalDomain) where pd.name=$domainName \n" +
            "MERGE (u)-[:HAS_WORKED_IN{domainExperienceInYrs: $domainExperienceInYrs }]->(pd)")
    public void createRelationUserAndProfessionalDomain(String email,String domainName, float domainExperienceInYrs );

    @Query("MATCH (u:UserProfile) where u.email=$email with u \n" +
            "MATCH (pe:ProfessionalExperience) where pe.name=$exprTag \n" +
            "MERGE (u)-[:HAS_EXPERIENCE_OF{experienceInYrs:$experienceInYrs}]->(pe)")
    public void createRelationshipUserAndProfessionalExperience(String email,String exprTag,float experienceInYrs);

    @Query("Match (u:UserProfile {email:$email})-[r]->(b) delete r")
    public void removeRelationships(String email);
}