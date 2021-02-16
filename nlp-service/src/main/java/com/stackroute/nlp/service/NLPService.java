package com.stackroute.nlp.service;


import com.stackroute.nlp.model.Project;

import java.util.List;

public interface NLPService {

    List<Project> searchResults(String content);

}
