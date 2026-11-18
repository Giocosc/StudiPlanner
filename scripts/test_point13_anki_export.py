def test_point13():
    with open("bundle.js", "r", encoding="utf-8") as f:
        bundle_content = f.read()

    assert "handleDownloadAnkiTsv" in bundle_content, "handleDownloadAnkiTsv missing in bundle"
    assert "Scarica Anki (.tsv)" in bundle_content, "Scarica Anki button missing in bundle"
    assert "#separator:tab" in bundle_content, "Anki separator header missing in bundle"
    assert "#tags column:3" in bundle_content, "Anki tags column header missing in bundle"
    print("Test Point 13 (Anki TSV Flashcard Export) passed successfully!")

if __name__ == "__main__":
    test_point13()
