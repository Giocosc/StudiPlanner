def test_point17():
    with open("bundle.js", "r", encoding="utf-8") as f:
        bundle_content = f.read()

    assert "calculateStudyStreak" in bundle_content, "calculateStudyStreak missing in bundle"
    assert "studyStreak" in bundle_content, "studyStreak missing in bundle"
    assert "Fiamma di Costanza" in bundle_content, "Fiamma di Costanza badge missing in bundle"
    assert "Ingegnere Notturno" in bundle_content, "Ingegnere Notturno badge missing in bundle"
    assert "Resilienza Lavoratore d'Acciaio" in bundle_content, "Resilienza Lavoratore badge missing in bundle"
    assert "Streak Attuale" in bundle_content, "Streak Attuale UI missing in bundle"
    print("Test Point 17 (Study Streak & Resilience Badges) passed successfully!")

if __name__ == "__main__":
    test_point17()
