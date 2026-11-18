def test_point19():
    with open("bundle.js", "r", encoding="utf-8") as f:
        bundle_content = f.read()

    assert "WeeklyRetrospectiveModal" in bundle_content, "WeeklyRetrospectiveModal missing in bundle"
    assert "Review Domenica" in bundle_content, "Review Domenica button missing in bundle"
    assert "Retrospezione Settimanale" in bundle_content, "Retrospezione header missing in bundle"
    assert "Settimana Esemplare da Lavoratore" in bundle_content, "Diagnostic message missing in bundle"
    print("Test Point 19 (Sunday Evening Weekly Retrospective Modal) passed successfully!")

if __name__ == "__main__":
    test_point19()
