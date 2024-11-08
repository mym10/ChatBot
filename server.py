# server.py
from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

tokenizer = AutoTokenizer.from_pretrained("EleutherAI/gpt-neo-1.3B")
model = AutoModelForCausalLM.from_pretrained("EleutherAI/gpt-neo-1.3B")

text_generator = pipeline("text-generation", model=model, tokenizer=tokenizer, device=-1)

@app.route("/generate", methods=["POST"])
def chat():
    data = request.get_json()
    msg = data.get("prompt", "")
    input_text = f"User: {msg}\nBot:"
    #input_text = msg
    #print("Received prompt:", msg)

    try:
        response_text = get_chat_response(input_text)
        #print("Generated response:", response_text) 
        return jsonify({"response": response_text})
    except Exception as e:
        print("Error generating response:", e)
        return jsonify({"response": "Sorry, there was an error."}), 500


def get_chat_response(text):
    response = text_generator(
        text,
        #max_length=150,
        temperature=0.5,
        top_k=50,
        top_p=0.9,
        num_return_sequences=1,
        no_repeat_ngram_size=2,
        clean_up_tokenization_spaces=True
    )[0]["generated_text"]

    response_text = response.split("Bot:")[-1].strip()
    
    return response_text


if __name__ == "__main__":
    app.run(debug=True)