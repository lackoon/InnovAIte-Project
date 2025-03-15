from dotenv import load_dotenv
import openai
import requests
import os

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPEN_AI_KEY"))

def askGPT(prompt):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{
            "role":
            "system",
            "content":
            "You are a helpful assistant who delivers emotionally intelligent responses."
        }, {
            "role": "user",
            "content": prompt
        }],
        temperature=0.7,
        max_tokens=100)
    return response.choices[0].message.content


if __name__ == "__main__":
    input = input("What do you want to ask? ")
    print(askGPT(input))