const furnitureDataset = [
  {
    name: "",
    image: "", 
    weight: 0, 
    sizeTiles: 0,
    isCraftingSurface: false,
    pickup: {
      skillRequired: [], // No skill required (Anyone can pick it up), or X / impossible to pick up, or ['Skill Name'] if a specific skill is required to pick up
      toolsRequired: []    // Empty array [] = No tools required, or "X" / impossible to pick up
    },
    disassemble: {
      skill: [],           // Leave empty "" if no skill is needed to disassemble or ( same as pickup ) 
      tools: []            // Empty array [] = No tools required to disassemble
    }
  }
];
