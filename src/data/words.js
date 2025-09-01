export const words = {
  hola: {
    spanish: "hola",
    english: "hello",
    pronunciation: "oh-lah",
    hint: "Greeting",
    category: "greetings",
    level: "A1"
  },
  gracias: {
    spanish: "gracias",
    english: "thank you",
    pronunciation: "grah-see-ahs",
    hint: "Expression of gratitude",
    category: "common phrases",
    level: "A1"
  },
  por_favor: {
    spanish: "por favor",
    english: "please",
    pronunciation: "por fah-vor",
    hint: "Polite request",
    category: "common phrases",
    level: "A1"
  },
  sí: {
    spanish: "sí",
    english: "yes",
    pronunciation: "see",
    hint: "Affirmation",
    category: "basic words",
    level: "A1"
  },
  no: {
    spanish: "no",
    english: "no",
    pronunciation: "noh",
    hint: "Negation",
    category: "basic words",
    level: "A1"
  },
  // Add more words as needed
};

export const levels = {
  A1: {
    name: "Beginner (A1)",
    topics: {
      greetings: [
        words.hola,
        words.gracias,
        words.por_favor,
        words.sí,
        words.no
      ],
      numbers: [
        {
          spanish: "uno",
          english: "one",
          pronunciation: "oo-no",
          hint: "First number",
          category: "numbers",
          level: "A1"
        },
        {
          spanish: "dos",
          english: "two",
          pronunciation: "dohs",
          hint: "Second number",
          category: "numbers",
          level: "A1"
        }
      ]
    }
  },
  A2: {
    name: "Elementary (A2)",
    topics: {
      family: [
        {
          spanish: "madre",
          english: "mother",
          pronunciation: "mah-dreh",
          hint: "Parent",
          category: "family",
          level: "A2"
        },
        {
          spanish: "padre",
          english: "father",
          pronunciation: "pah-dreh",
          hint: "Parent",
          category: "family",
          level: "A2"
        }
      ]
    }
  },
  B1: {
    name: "Intermediate (B1)",
    topics: {
      work: [
        {
          spanish: "trabajo",
          english: "work",
          pronunciation: "trah-bah-ho",
          hint: "Occupation",
          category: "work",
          level: "B1"
        }
      ]
    }
  },
  B2: {
    name: "Upper Intermediate (B2)",
    topics: {
      abstract: [
        {
          spanish: "oportunidad",
          english: "opportunity",
          pronunciation: "oh-por-too-nee-dahd",
          hint: "Chance",
          category: "abstract",
          level: "B2"
        }
      ]
    }
  }
};
