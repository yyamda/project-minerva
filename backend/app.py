from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI
from pydantic import BaseModel
from pinecone import Pinecone
import os

from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
pinecone = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

class BasicString(BaseModel):
    explanation: str
    output: str


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)


@app.route('/')
def index():
    return "hello world"

@app.route('/api/hello')
def hello():
    return jsonify({"message": "Hello, World!", "status": "success"})

@app.route('/api/numbers')
def get_numbers():
    return jsonify({
        "numbers": [1, 2, 3, 4, 5],
        "sum": 15,
        "status": "success"
    })

@app.route('/api/create-course', methods=['POST', 'OPTIONS'])
def create_course():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        headers = response.headers

        # Adjust origin to match your frontend origin!
        headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        headers['Access-Control-Allow-Headers'] = 'Content-Type'

        return response
    
    data = request.get_json()


    if data is None:
        return jsonify({"error": "Invalid JSON"}), 400

    course_name = data.get("courseName")
    course_description = data.get("courseDescription")
    experience = data.get("experience")

    print(f"Received: coalling client now")

    system_prompt = """
        You are an expert course designer. The user will tell you what topic they want to learn, their ultimate goal, and their current background experience. 
        You must build a conceptual learning roadmap of up to 10 topics. 
        Each topic should be a conceptual subject area (not an action step or task). 
        Make sure the last topic is the goal the user says. Do not include topics that are the extension of the goal.
        Number each topic clearly and provide a concise description of what the learner will understand at that stage.
    """

    user_prompt = f"""
        Topic: {course_name}
        Goal: {course_description}
        Background Experience: {experience}

        Please create a numbered list of up to 10 conceptual topics I should study to reach my goal, given my background. 
        Include a short description for each topic.
    """

    response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
         {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ],
)   
    text_response = response.choices[0].message.content
    print(text_response)

    return jsonify({
        "status": "success",
        "message": "Course created",
        "received": {
            "returntext": text_response
        }
    })

@app.route('/api/summarize-course', methods=['POST', 'OPTIONS'])
def summarize_course():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        headers = response.headers

        # Adjust origin to match your frontend origin!
        headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        headers['Access-Control-Allow-Headers'] = 'Content-Type'

        return response
    
    data = request.get_json()
    if data is None:
        return jsonify({"error": "Invalid JSON"}), 400

    conversation_transcript = data.get("transcript")
    roadmap = data.get("roadmap")

    print(f"Received: coalling client now")

    system_prompt = """
        You are an expert learning path designer and summarizer.

        You will receive:
        - A detailed learning roadmap outlining topics to learn.
        - A conversation transcript where the user discusses their current understanding and readiness.

        Your job is to:
        1. Analyze the conversation to assess the user’s actual strengths and weaknesses.
        2. Adjust the original roadmap accordingly: keep only the topics that are truly needed, remove topics the user has already mastered, and add or modify topics if any gaps are identified.
        3. Make the length of words in topics a little bit long and description: around 5 to 8 words to specify the domain field
        4. Return ONLY the final, adjusted list of topics as a single, plain, comma-separated string with no numbers, no extra explanations, and no descriptions.

        Be precise and concise. Do not include any other text in your response.
    """

    user_prompt = f"""
        Original Roadmap:
        {roadmap}

        Conversation Transcript:
        {conversation_transcript}

        Please analyze the user's strengths and weaknesses, adjust the roadmap accordingly, and return ONLY a single comma-separated list of the final topics to learn.
    """

    response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
         {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ],
)   
    text_response = response.choices[0].message.content

    return jsonify({
        "status": "success",
        "message": "Finalized topic List",
        "received": {
            "topicList": text_response
        }
    })

@app.route('/api/fetch_pinecone', methods=['POST', 'OPTIONS'])
def fetch_pinecone_content():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        headers = response.headers

        # Adjust origin to match your frontend origin!
        headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        headers['Access-Control-Allow-Headers'] = 'Content-Type'

        return response
    
    data = request.get_json()
    if data is None:
        return jsonify({"error": "Invalid JSON"}), 400

    topics_string = data.get("topics_list")
    topics_list = topics_string.split(",")
    print("Searching for this topic list: ", topics_list)
    index = pinecone.Index("education-content")

    results = []
    for i, topic in enumerate(topics_list):
        response = index.search(
        namespace="__default__", 
        query={
            "inputs": {"text": topic}, 
            "top_k": 7
            },
        )
        print(i)
        results.append({"topic": topic, "contents": response.to_dict()})

    print(len(results))
    print("Pinecone fetch results: ", results)
    return jsonify({
        "status": "success",
        "message": "Topic and Content Roadmap",
        "received": {
            "course_roadmap": results,
        }
    })


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)