from googleapiclient.discovery import build
import os

class CivicService:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("CIVIC_API_KEY")
        if self.api_key:
            self.service = build('civicinfo', 'v2', developerKey=self.api_key)
        else:
            self.service = None

    def get_voter_info(self, address: str):
        if not self.service:
            return {"error": "Civic API Key not configured"}
        
        try:
            # voterInfoQuery returns information about an upcoming election including polling locations and ballot information
            results = self.service.voterInfo().voterInfoQuery(address=address).execute()
            return results
        except Exception as e:
            return {"error": str(e)}

    def get_representatives(self, address: str):
        if not self.service:
            return {"error": "Civic API Key not configured"}
        
        try:
            # representativeInfoByAddress returns information about political representatives for a given address
            results = self.service.representatives().representativeInfoByAddress(address=address).execute()
            return results
        except Exception as e:
            return {"error": str(e)}
