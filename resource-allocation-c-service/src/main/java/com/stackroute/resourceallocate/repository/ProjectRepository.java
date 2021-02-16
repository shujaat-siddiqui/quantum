package com.stackroute.resourceallocate.repository;

import com.stackroute.resourceallocate.model.Project;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface ProjectRepository extends Neo4jRepository<Project,String>
{
    Project findByName(String projectName);
}
