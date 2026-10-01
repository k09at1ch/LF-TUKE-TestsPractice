import os
import json
import time
import requests
import markovify
from deep_translator import GoogleTranslator

# 1. Custom function to fetch Wikipedia text safely without 403 blocks
def get_wikipedia_text(title, lang="uk"):
    headers = {
        'User-Agent': 'SentenceDatasetGenerator/1.0 (contact@example.com)'
    }
    url = f"https://{lang}.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "prop": "extracts",
        "explaintext": True,
        "titles": title,
        "format": "json"
    }
    
    response = requests.get(url, headers=headers, params=params)
    data = response.json()
    
    pages = data.get("query", {}).get("pages", {})
    for page_id, page_data in pages.items():
        if "extract" in page_data:
            return page_data["extract"]
    return ""

# Download Ukrainian text to train the AI
print("Downloading Ukrainian text from Wikipedia to train the AI...")
topics = ["Історія України", "Київ", "Українська мова", "Європа", "Культура"]
training_text = ""

for topic in topics:
    try:
        print(f" - Downloading '{topic}'...")
        text = get_wikipedia_text(topic)
        if text:
            training_text += text + "\n"
        else:
            print(f"   No content returned for {topic}")
    except Exception as e:
        print(f"   Failed to download {topic}: {e}")

# Verify that text was actually downloaded
if not training_text.strip():
    raise ValueError("Error: No text was downloaded. Markovify cannot train on empty text.")

# 2. Train the AI Text Generator
print("\nTraining the Markov Chain AI...")
ai_model = markovify.Text(training_text)

# 3. Set up the Translator and Dataset
translator = GoogleTranslator(source='uk', target='sk')
dataset = []
target_count = 5000

print(f"\nGenerating and translating {target_count} sentences...")

while len(dataset) < target_count:
    # Ask the AI to generate a unique sentence
    uk_sentence = ai_model.make_sentence()
    
    if uk_sentence:
        try:
            sk_sentence = translator.translate(uk_sentence)
            
            dataset.append({
                "id": len(dataset) + 1,
                "question": uk_sentence,
                "answer": sk_sentence
            })
            
            if len(dataset) % 50 == 0:
                print(f"Generated {len(dataset)} / {target_count} sentences...")
                
            time.sleep(0.3)  # Rate limiting for translation API
            
        except Exception as e:
            print("Translation paused, waiting 5 seconds...")
            time.sleep(5)

# 4. Save JSON directly into your DataSet component folder
script_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(script_dir, "uk_sk_5k_dataset.json")

print(f"\nSaving dataset to {json_path}...")
with open(json_path, "w", encoding="utf-8") as file:
    json.dump(dataset, file, ensure_ascii=False, indent=2)

print("✅ Success! Your 5,000 sentence AI dataset is saved in your project.")