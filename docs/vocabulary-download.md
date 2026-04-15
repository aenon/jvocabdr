# Vocabulary Data Sources

Download these files during initial setup to populate your vocabulary database.

---

## Option 1: CEFR-J Vocabulary Profile (Recommended)

**Source:** https://github.com/openlanguageprofiles/olp-en-cefrj  
**License:** Free for research and commercial use (cite CEFR-J)  
**Format:** JSON

```bash
# Download all CEFR-J data
curl -L -o cefr-vocab.json https://raw.githubusercontent.com/openlanguageprofiles/olp-en-cefrj/master/olp-en-cefrj.json
```

---

## Option 2: Words-CEFR-Dataset (Structured)

**Source:** https://github.com/Maximax67/Words-CEFR-Dataset  
**License:** MIT  
**Format:** SQLite + CSV

```bash
# Clone the repository
git clone https://github.com/Maximax67/Words-CEFR-Dataset.git vocabulary-data

# Or download specific files
curl -L -o words-cefr.csv https://raw.githubusercontent.com/Maximax67/Words-CEFR-Dataset/main/csv/words.csv
curl -L -o word-pos.csv https://raw.githubusercontent.com/Maximax67/Words-CEFR-Dataset/main/csv/word_pos.csv
```

---

## Option 3: English Vocabulary Word List (Simple TXT)

**Source:** https://github.com/jnoodle/English-Vocabulary-Word-List  
**License:** Public domain / Open  
**Format:** TXT

```bash
# Oxford 3000 words
curl -L -o oxford-3000.txt https://raw.githubusercontent.com/jnoodle/English-Vocabulary-Word-List/master/oxford_3000.txt

# Oxford 5000 words
curl -L -o oxford-5000.txt https://raw.githubusercontent.com/jnoodle/English-Vocabulary-Word-List/master/oxford_5000.txt

# Longman Communication 3000
curl -L -o longman-3000.txt https://raw.githubusercontent.com/jnoodle/English-Vocabulary-Word-List/master/longman_communication_3000.txt
```

---

## Option 4: Oxford 5000 with Definitions (JSON)

**Source:** https://github.com/winterdl/oxford-5000-vocabulary-audio-definition  
**License:** Based on Oxford list (non-commercial use)  
**Format:** JSON, CSV

```bash
# Oxford 3000 JSON (with definitions)
curl -L -o oxford-3000.json https://raw.githubusercontent.com/winterdl/oxford-5000-vocabulary-audio-definition/main/data/oxford_3000.json

# Oxford 5000 JSON (with definitions)
curl -L -o oxford-5000.json https://raw.githubusercontent.com/winterdl/oxford-5000-vocabulary-audio-definition/main/data/oxford_5000.json
```

---

## Option 5: 3000 Most Used Words (CSV with CEFR)

**Source:** https://www.englishsteps.co.uk/blog/3000-most-used-words-in-english-free-download  
**License:** Free  
**Format:** CSV

```bash
# Direct CSV download
curl -L -o 3000-words.csv "https://www.englishsteps.co.uk/wp-content/uploads/2023/02/3000_most_used_words_Excel_Spreadsheet.csv.csv"
```

---

## Recommended Setup

For this vocabulary builder, I recommend **Option 4** (Oxford 5000 with definitions) because:

1. ✅ Words have definitions included
2. ✅ JSON format is easy to process
3. ✅ CEFR levels available
4. ✅ Can filter by proficiency level

### Quick Setup Script

```bash
#!/bin/bash
# vocabulary-setup.sh

mkdir -p data/downloads
cd data/downloads

# Download Oxford 5000 with definitions
curl -L -o oxford-5000.json https://raw.githubusercontent.com/winterdl/oxford-5000-vocabulary-audio-definition/main/data/oxford_5000.json

# Download Oxford 3000 with definitions  
curl -L -o oxford-3000.json https://raw.githubusercontent.com/winterdl/oxford-5000-vocabulary-audio-definition/main/data/oxford_3000.json

echo "Download complete! Files in data/downloads/"
```

---

## Data Format for This App

The vocabulary JSON should have this structure:

```json
[
  {
    "id": "1",
    "word": "abandon",
    "definition": "to leave completely",
    "example": "They had to abandon the ship.",
    "difficulty": "medium",
    "level": "B2"
  }
]
```

You'll need to convert the downloaded data to this format before seeding Firestore.

---

## License Notes

| Source | License | Commercial Use |
|--------|---------|----------------|
| CEFR-J | Free (cite) | ✅ Yes |
| Words-CEFR-Dataset | MIT | ✅ Yes |
| Oxford Lists | Oxford (non-commercial) | ⚠️ Check terms |
| English Steps | Free | ✅ Yes |

---

*Last updated: 2026-04-14*