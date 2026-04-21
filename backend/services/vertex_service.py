import google.generativeai as genai
import os

class GeminiService:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("VERTEX_AI_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel(
            "gemini-1.5-pro",
            system_instruction=(
                "You are CivicPulse AI, an interactive educational assistant for the Google Hackathon. "
                "Your mission is to help users understand the election process, timelines, and steps. "
                "Provide non-partisan, authoritative, and easy-to-follow explanations. "
                "Focus on voter registration, polling procedures, and how ballot measures work. "
                "Always remain professional and helpful."
            )
        )

    def get_chat_response(self, messages: list):
        """
        messages: list of dicts with {'role': 'user'|'model', 'parts': [str]}
        """
        chat = self.model.start_chat(history=messages[:-1])
        response = chat.send_message(messages[-1]['parts'][0])
        return response.text

    async def analyze_ballot(self, image_bytes: bytes, mime_type: str = "image/jpeg"):
        # Keep this for multimodal chat if needed in future
        content = [
            {"mime_type": mime_type, "data": image_bytes},
            "Analyze this civic document and explain its significance in the election process."
        ]
        response = self.model.generate_content(content)
        return response.text
