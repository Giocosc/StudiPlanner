def test_point20():
    with open("bundle.js", "r", encoding="utf-8") as f:
        bundle_content = f.read()

    assert "isPreExamWindow" in bundle_content, "isPreExamWindow missing in bundle"
    assert "Sprint Pre-Esame" in bundle_content, "Sprint Pre-Esame toggle button missing in bundle"
    assert "Modalità Ripasso Sprint Pre-Esame" in bundle_content, "Triage banner missing in bundle"
    assert "isHighPrio" in bundle_content or "isExamTrial" in bundle_content, "Triage filtering missing in bundle"
    print("Test Point 20 (Pre-Exam 7-Day Express Review Triage Mode) passed successfully!")

if __name__ == "__main__":
    test_point20()
