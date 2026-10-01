import os
import time
import requests
import markovify

HEADERS = {
    'User-Agent': 'MassiveTopicEssayAI/1.0 (contact@example.com)'
}

def fetch_massive_corpus(topic, lang="en", max_articles=1000):
    """
    Searches Wikipedia for a topic and downloads up to max_articles 
    by paging through the results safely.
    """
    api_url = f"https://{lang}.wikipedia.org/w/api.php"
    print(f"\n🔍 Searching [{lang.upper()}] Wikipedia for '{topic}' (Target: {max_articles} articles)...")
    
    corpus = []
    offset = 0
    search_batch_size = 50
    
    while offset < max_articles:
        print(f"   -> Fetching search results {offset + 1} to {offset + search_batch_size}...")
        
        # 1. Search Wikipedia with pagination
        search_params = {
            "action": "query",
            "list": "search",
            "srsearch": topic,
            "srlimit": search_batch_size,
            "sroffset": offset,
            "format": "json"
        }
        
        try:
            res = requests.get(api_url, headers=HEADERS, params=search_params)
            if res.status_code != 200:
                print(f"   -> Search query returned HTTP {res.status_code}. Pausing...")
                time.sleep(3)
                offset += search_batch_size
                continue
            search_data = res.json()
        except Exception as e:
            print(f"   -> Search query failed: {e}. Skipping...")
            offset += search_batch_size
            time.sleep(2)
            continue
            
        search_results = search_data.get("query", {}).get("search", [])
        
        if not search_results:
            print("   -> Reached the end of Wikipedia's results for this topic.")
            break
            
        page_ids = [str(item["pageid"]) for item in search_results]
        
        # 2. Extract text in smaller sub-batches (20 pages) to prevent URL length issues
        sub_batch_size = 20
        for i in range(0, len(page_ids), sub_batch_size):
            chunk_ids = page_ids[i:i + sub_batch_size]
            
            extract_params = {
                "action": "query",
                "prop": "extracts",
                "explaintext": True,
                "pageids": "|".join(chunk_ids),
                "format": "json"
            }
            
            try:
                response = requests.get(api_url, headers=HEADERS, params=extract_params)
                
                # Check for HTTP errors or blocks
                if response.status_code != 200:
                    print(f"   -> Text batch returned HTTP {response.status_code}. Pausing...")
                    time.sleep(3)
                    continue
                    
                ext_res = response.json()
                pages = ext_res.get("query", {}).get("pages", {})
                
                # Clean and collect text
                for p_id, p_data in pages.items():
                    text = p_data.get("extract", "").strip()
                    if len(text) > 300:
                        corpus.append(text)
                        
            except Exception as e:
                print(f"   -> Failed to parse text sub-batch: {e}. Skipping chunk...")
                time.sleep(2)
                continue
                
            time.sleep(0.3)  # Gentle rate-limiting between sub-batches
            
        offset += search_batch_size
        time.sleep(1)  # 1-second delay between main search batches

    final_text = "\n\n".join(corpus)
    word_count = len(final_text.split())
    
    print(f"✅ Downloaded {len(corpus)} valid articles! (Total words: {word_count:,})")
    return final_text

def generate_essay(topic, lang="en", paragraphs=5, sentences_per_para=6):
    # Fetch training dataset
    corpus = fetch_massive_corpus(topic, lang=lang, max_articles=1000)
    
    if not corpus.strip():
        return "Error: Could not generate essay due to missing or empty content."
    
    print("\n🧠 Digesting text and training the Markov AI Model...")
    # state_size=3 produces highly natural grammar when given large datasets
    model = markovify.Text(corpus, state_size=3)
    
    print("\n✍️ Generating essay...")
    essay = []
    
    for _ in range(paragraphs):
        para = []
        tries = 0
        while len(para) < sentences_per_para and tries < 100:
            sentence = model.make_sentence(tries=100)
            tries += 1
            if sentence and sentence not in para:
                para.append(sentence)
        
        if para:
            essay.append(" ".join(para))
    
    return "\n\n".join(essay)

if __name__ == "__main__":
    print("=========================================")
    print("  MASSIVE AI ESSAY GENERATOR (1000+ Docs)")
    print("=========================================\n")
    
    user_topic = input("Enter any theme (e.g., 'Artificial Intelligence', 'Історія Києва'): ").strip()
    user_lang = input("Enter language ('en' for English, 'uk' for Ukrainian) [default: en]: ").strip().lower() or "en"
    
    if user_topic:
        start_time = time.time()
        
        # Generate essay
        final_essay = generate_essay(user_topic, lang=user_lang)
        
        # Display output
        print("\n" + "="*60)
        print(f"  ESSAY: {user_topic.upper()}")
        print("="*60 + "\n")
        print(final_essay)
        print("\n" + "="*60)
        
        # Save to local directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        filename = f"Essay_{user_topic.replace(' ', '_')}.txt"
        file_path = os.path.join(script_dir, filename)
        
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(f"ESSAY: {user_topic.upper()}\n")
            file.write("="*40 + "\n\n")
            file.write(final_essay)
            
        elapsed_time = round(time.time() - start_time, 1)
        print(f"💾 Saved to: {filename}")
        print(f"⏱️ Total time taken: {elapsed_time} seconds.")