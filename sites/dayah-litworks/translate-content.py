import json
import translate

template_file = '/tmp/pab-work/sites/dayah-litworks/content/es.json'
output_file = '/tmp/pab-work/sites/dayah-litworks/content/en.json'

def translate_content(template_file, output_file):
    with open(template_file, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    translated_data = translate.translate_json(data)
    
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(translated_data, file, ensure_ascii=False, indent=4)

translate_content(template_file, output_file)