package com.stackroute.nlp.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stackroute.nlp.model.Name;
import com.stackroute.nlp.model.Project;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.CoreDocument;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

// PERSON, CITY, STATE_OR_PROVINCE, COUNTRY, EMAIL, TITLE, LOCATION
// JJ, JJR, NN, NNS, NNP, NNPS,

@Service
public class NLPServiceImpl implements NLPService {

    private StanfordCoreNLP stanfordCoreNLP;
    private ResourceLoader resourceLoader;
    @Autowired
    private SearchServiceClient searchServiceClient;

    List<String> acceptedPOS = Arrays.asList("JJ", "JJR", "NN", "NNS", "NNP", "NNPS");

    public NLPServiceImpl(StanfordCoreNLP stanfordCoreNLP, ResourceLoader resourceLoader) {
        this.stanfordCoreNLP = stanfordCoreNLP;
        this.resourceLoader = resourceLoader;
    }

    @Override
    public List<Project> searchResults(final String content) {

        Set<String> extractedWords = new HashSet<>();

        CoreDocument coreDocument = new CoreDocument(content);
        stanfordCoreNLP.annotate(coreDocument);
        List<CoreLabel> coreLabels = coreDocument.tokens();

        for(CoreLabel coreLabel: coreLabels) {
            String ner = coreLabel.get(CoreAnnotations.PartOfSpeechAnnotation.class);

            if (acceptedPOS.contains(ner))
                extractedWords.add(coreLabel.originalText());
        }

        List<Name> avaliableLocations = fetchFromJson("/location.json");
        List<Name> avaliableDesignations = fetchFromJson("/designation.json");
        List<Name> avaliableDomains = fetchFromJson("/domain.json");
        List<Name> avaliableSkills = fetchFromJson("/skill.json");

        List<String> filteredString = new ArrayList<>();

        outerloop:
        for (String value: extractedWords) {

            value = value.substring(0, 1).toUpperCase()+value.substring(1).toLowerCase();

            // Location
            for (Name name: avaliableLocations) {
                if (name.getValues().contains(value)) {
                    filteredString.add(name.getName());
                    continue outerloop;
                }
            }

            // Designation
            for (Name name: avaliableDesignations) {
                if (name.getValues().contains(value)) {
                    filteredString.add(name.getName());
                    continue outerloop;
                }
            }

            // Domain
            for (Name name: avaliableDomains) {
                if (name.getValues().contains(value)) {
                    filteredString.add(name.getName());
                    continue outerloop;
                }
            }

            //Skill
            for (Name name: avaliableSkills) {
                if (name.getValues().contains(value)) {
                    filteredString.add(name.getName());
                    continue outerloop;
                }
            }
            filteredString.add(value);
        }
        String result = filteredString.stream()
                .collect(Collectors.joining(" "));

        return searchServiceClient.searchResponse(result);
    }

    private List<Name> fetchFromJson(final String filename) {

        ObjectMapper mapper = new ObjectMapper();
        TypeReference<List<Name>> typeReference = new TypeReference<List<Name>>() {};

        InputStream inputStream = TypeReference.class.getResourceAsStream(filename);

        try {
            List<Name> names = mapper.readValue(inputStream, typeReference);
            return names;
        } catch (IOException e){
            System.out.println("Unable to read from " + filename+ ": " + e.getMessage());
        }
        return null;
    }

}