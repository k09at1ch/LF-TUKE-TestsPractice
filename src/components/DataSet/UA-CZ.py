import json
import os
import urllib.request
import ssl
import warnings
from pathlib import Path
import argostranslate.package
import argostranslate.translate

# Suppress warnings and fix macOS SSL for the initial word list download
warnings.filterwarnings("ignore")
ssl._create_default_https_context = ssl._create_unverified_context

def setup_local_translator():
    print("Connecting to Argos open-source package index...")
    argostranslate.package.update_package_index()
    available_packages = argostranslate.package.get_available_packages()
    
    # Argos uses English as a pivot for UK->CS, so we download both halves
    print("Checking/installing Ukrainian -> English model (may take a minute on first run)...")
    uk_en = next(filter(lambda x: x.from_code == 'uk' and x.to_code == 'en', available_packages), None)
    if uk_en: 
        uk_en.install()
        
    print("Checking/installing English -> Czech model (may take a minute on first run)...")
    en_cs = next(filter(lambda x: x.from_code == 'en' and x.to_code == 'cs', available_packages), None)
    if en_cs: 
        en_cs.install()
        
    print("Local AI models downloaded and ready!")

def download_clean_ukrainian_words(target_count=15000):
    print(f"Downloading and filtering {target_count} pure Ukrainian words...")
    url = "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/uk/uk_50k.txt"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    words = []
    russian_chars = set("ыэъёЫЭЪЁ")
    
    try:
        with urllib.request.urlopen(req) as response:
            lines = response.read().decode('utf-8').splitlines()
            for line in lines:
                word = line.split()[0].strip().lower()
                
                if any(char in russian_chars for char in word):
                    continue
                if word.isalpha() and len(word) > 2:
                    words.append(word)
                if len(words) >= target_count:
                    break
        return words
    except Exception as e:
        print(f"Failed to download words: {e}")
        return []

def generate_automated_database(num_entries=15000):
    desktop_path = os.path.join(Path.home(), "Desktop")
    output_file = os.path.join(desktop_path, "ukr_cze_database.json")

    # Step 1: Get the words
    uk_words = download_clean_ukrainian_words(target_count=num_entries)
    if not uk_words:
        return
        
    # Step 2: Ensure local translation models are installed
    setup_local_translator()

    print(f"Starting completely offline translation of {len(uk_words)} words...")
    
    database = []
    
    # Step 3: Fast local translation loop (no network delays required)
    for index, uk_word in enumerate(uk_words, start=1):
        try:
            # The library automatically pivots UK -> EN -> CS internally
            cz_word = argostranslate.translate.translate(uk_word, "uk", "cs")
            
            database.append({
                "id": index,
                "question": uk_word,
                "answer": cz_word
            })
            
            # Print progress every 500 words since it moves much faster now
            if index % 500 == 0:
                print(f"Progress: {index} / {len(uk_words)} words translated locally...")
                
        except Exception as e:
            print(f"Failed to translate '{uk_word}': {e}")

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(database, f, ensure_ascii=False, indent=2)
        
    print(f"\nDone! Database successfully saved to: {output_file}")

if __name__ == "__main__":
    TARGET_ENTRIES = 15000 
    generate_automated_database(num_entries=TARGET_ENTRIES)