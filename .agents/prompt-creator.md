# Lean Prompt Garden: Prompt Creator Agent

## Purpose

This document defines a specialized agent for creating new prompts that follow the pattern and spirit of the Lean Prompt Garden. Prompts must be consistent with the "software gardening" philosophy and lean development practices.

## Analysis of Existing Pattern

### Required JSON Structure

Prompts follow a dual structure in `public/prompts.json`:

```json
{
  "prompts": [
    {
      "name": "gardener_[category]_[function]",
      "title": "Gardener · [Human Readable Title]",
      "description": "[Brief description focusing on outcome]",
      "arguments": [
        {
          "name": "[param_name]",
          "description": "[Clear parameter description]",
          "required": true/false
        }
      ]
    }
  ],
  "definitions": {
    "[same_name_as_above]": {
      "name": "[same_name]",
      "title": "[same_title]",
      "description": "[same_or_slightly_expanded_description]",
      "messages": [
        {
          "role": "user",
          "content": {
            "type": "text",
            "text": "[Structured prompt content - see pattern below]"
          }
        }
      ]
    }
  }
}
```

### Prompt Content Pattern

All existing prompts follow this strict structure:

```
ROLE: [Specific role definition - e.g., "Autonomous Software Gardener"]
[SCOPE/TARGET]: [What will be worked on - using variable substitution]
[CONSTRAINTS/LIMITS]: [Specific measurable limits - lines, files, time]
TASK:
[Numbered list of specific actions to take]
[Additional sections like CONSTRAINTS, OUTPUT, etc. as needed]
```

### Key Characteristics Identified

1. **Naming Convention**: `gardener_[domain]_[action]`
2. **Title Pattern**: "Gardener · [Descriptive Action]"
3. **Philosophy**: 
   - Incremental, reversible changes
   - Evidence-driven decisions
   - Behavior preservation
   - CI/testing emphasis
   - Measurable limits and outcomes

## Command: Create New Prompt

### ROLE
Expert in Software Gardening and Lean Development Practices

### EXPECTED INPUT
One of the following:
- **Conversation**: Transcript of a conversation describing a development problem and its solution
- **Description**: Markdown document describing a specific development practice
- **Specification**: Direct description of what the prompt should do

### CREATION PROCESS

#### 1. Input Analysis
- Identify the **domain** (refactoring, testing, architecture, etc.)
- Identify the **main action** (reducer, clarifier, gardener, etc.)
- Extract specific **constraints/limits** mentioned
- Identify necessary **arguments/parameters**

#### 2. Prompt Generation

**Step 2.1: Define Metadata**
```
name: gardener_[domain]_[action]
title: Gardener · [Action Description]
description: [One-line outcome-focused description]
```

**Step 2.2: Identify Arguments**
Extract parameters that need configuration:
- Code paths/targets
- Numerical limits (lines, files, time)
- Validation commands
- Specific flags or configurations

**Step 2.3: Structure Prompt Content**
```
ROLE: [Specific software gardening role]
TARGET/SCOPE: [Using {{variable_substitution}}]
LIMITS: [Specific measurable constraints]
TASK:
1) [First action - usually analysis/identification]
2) [Second action - usually preparation/testing]  
3) [Third action - usually implementation]
4) [Fourth action - usually validation]
[CONSTRAINTS section if needed]
[OUTPUT section describing expected deliverable]
```

#### 3. Consistency Validation

**Quality Checklist**:
- [ ] Follows naming pattern `gardener_*`?
- [ ] Title uses "Gardener ·" prefix?
- [ ] Arguments are specific and useful?
- [ ] Includes measurable limits?
- [ ] Emphasizes behavior preservation?
- [ ] Mentions testing/CI?
- [ ] Is incremental and reversible?
- [ ] Includes rollback/evidence plan?

#### 4. Integration into prompts.json

**Step 4.1**: Add entry to `prompts` array
**Step 4.2**: Add complete definition to `definitions` object
**Step 4.3**: Validate JSON syntax
**Step 4.4**: Test variable interpolation

## Reference Templates

### Basic Template
```markdown
ROLE: Software Gardener specialized in [DOMAIN].
TARGET: {{target_parameter}}
LIMITS: [Specific constraints using {{limit_parameters}}]
TASK:
1) [Analysis step]
2) [Preparation step with tests]
3) [Implementation step]
4) [Validation step]
OUTPUT: [Deliverable description with evidence requirements]
```

### Advanced Constraints Template
```markdown
ROLE: [Specific gardening role].
TARGET: {{target}}
LIMITS: Max [metric] ≤ {{limit}}; [other constraints].
TASK:
1) [Identification with evidence]
2) [Testing preparation]
3) [Incremental implementation]  
4) [Validation with metrics]
CONSTRAINTS: [Specific prohibitions]
OUTPUT: [PR template with required sections]
```

## Domain Examples by Category

### Refactoring/Structure
- `gardener_extract_*` - Extraction refactorings
- `gardener_inline_*` - Inlining operations
- `gardener_move_*` - Code movement
- `gardener_split_*` - Component splitting

### Quality/Cleanup  
- `gardener_simplify_*` - Complexity reduction
- `gardener_normalize_*` - Standardization
- `gardener_optimize_*` - Performance improvements
- `gardener_secure_*` - Security hardening

### Architecture/Design
- `gardener_decouple_*` - Dependency management
- `gardener_abstract_*` - Abstraction introduction
- `gardener_pattern_*` - Design pattern application
- `gardener_model_*` - Domain modeling

## Validation and Testing

### Pre-Integration Checks
1. **JSON Validity**: Validate complete JSON syntax
2. **Variable Substitution**: Verify all `{{}}` variables have corresponding arguments
3. **Consistency**: Compare with existing prompts for consistency
4. **Completeness**: Verify includes all required sections

### Post-Integration Testing
1. **Render Test**: Verify prompt renders correctly in UI
2. **Argument Validation**: Verify all arguments work
3. **Copy Functionality**: Verify copy-to-clipboard works
4. **Search Integration**: Verify appears in relevant searches

## AI Feedback Learning Loop Application

After creating a prompt with this command:

1. **Collect Feedback**: Observe how the new prompt is used
2. **Identify Patterns**: Which arguments are used most? Which constraints are problematic?
3. **Propose Improvements**: Suggest refinements to this document based on experience
4. **Evolve**: Update templates and validations according to learnings

## Command Usage

### For AI Assistant:
```
Using prompt-creator.md, analyze the following [conversation/description] and generate a new prompt for the Lean Prompt Garden that [specific objective]. Follow all steps in the creation process and provide the complete JSON for integration.
```

### For Manual Development:
1. Review this document completely
2. Analyze your input using the "Input Analysis" section
3. Follow the "Creation Process" step by step
4. Use templates as reference
5. Apply complete validation before integrating

---

**Note**: This document should evolve based on usage feedback and application of the ai-feedback-learning-loop.mdc rule. Each new experience should inform improvements to the process and templates.