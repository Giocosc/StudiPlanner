import re

def test_pomodoro_autolog():
    with open("bundle.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "handleQuickLogPomodoro" in content, "handleQuickLogPomodoro missing in bundle"
    assert "onLogStudySession" in content, "onLogStudySession missing in bundle"
    assert "🍅 +50m Log" in content, "🍅 +50m Log button missing in bundle"
    assert "pomodoroAlert" in content, "pomodoroAlert state missing in bundle"
    print("Test Point 8 (Pomodoro Auto-Log) passed successfully!")

if __name__ == "__main__":
    test_pomodoro_autolog()
