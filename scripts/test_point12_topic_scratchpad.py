def test_point12():
    with open("bundle.js", "r", encoding="utf-8") as f:
        bundle_content = f.read()

    assert "Appunti & Scratchpad" in bundle_content, "Appunti & Scratchpad tab missing in bundle"
    assert "Salva Appunti" in bundle_content, "Salva Appunti button missing in bundle"
    assert "scratchpadNotes" in bundle_content, "scratchpadNotes missing in bundle"
    assert "Domanda per il Ricevimento" in bundle_content, "Snippet missing in bundle"
    print("Test Point 12 (Topic Markdown Scratchpad & Notes) passed successfully!")

if __name__ == "__main__":
    test_point12()
