from icalendar import Calendar, Event
from datetime import datetime
import io

class CalendarService:
    def generate_ics(self, events: list):
        """
        events: list of dicts with {'summary': str, 'description': str, 'date': str (YYYY-MM-DD)}
        """
        cal = Calendar()
        for ev_data in events:
            event = Event()
            event.add('summary', ev_data['summary'])
            event.add('description', ev_data['description'])
            dt = datetime.strptime(ev_data['date'], '%Y-%m-%d')
            event.add('dtstart', dt)
            event.add('dtend', dt)
            cal.add_component(event)
        
        return cal.to_ical()
