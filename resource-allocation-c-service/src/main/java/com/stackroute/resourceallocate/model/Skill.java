package com.stackroute.resourceallocate.model;

import com.stackroute.resourceallocate.enums.SkillLevel;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Skill {

    private String skillName;
    private SkillLevel level;

}
