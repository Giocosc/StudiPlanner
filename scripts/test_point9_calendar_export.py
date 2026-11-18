import re
import json

def test_point9():
    with open("bundle.js", "r", encoding="utf-8") as f:
        bundle_content = f.read()

    assert "generateIcsCalendar" in bundle_content, "generateIcsCalendar missing in bundle"
    assert "downloadIcsCalendar" in bundle_content, "downloadIcsCalendar missing in bundle"
    assert "Esporta .ics" in bundle_content or "Esporta Calendario (.ics)" in bundle_content, "Export .ics button missing in bundle"

    # Verify logic using regex or direct logic test
    assert "BEGIN:VCALENDAR" in bundle_content
    assert "BEGIN:VEVENT" in bundle_content
    assert "19:30" in bundle_content
    assert "10:00" in bundle_content
    print("Test Point 9 (Calendar Export .ics) passed successfully!")

if __name__ == "__main__":
    test_point9()
