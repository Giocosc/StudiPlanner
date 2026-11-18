def test_point11():
    with open("bundle.js", "r", encoding="utf-8") as f:
        bundle_content = f.read()

    assert "PdfSplitView" in bundle_content, "PdfSplitView missing in bundle"
    assert "Split PDF" in bundle_content, "Split PDF button missing in bundle"
    assert "Viewer Dispense & Eserciziari" in bundle_content, "Viewer header missing in bundle"
    assert "Carica PDF Locale" in bundle_content, "Carica PDF Locale button missing in bundle"
    assert "Dispense Teoria: Analisi Matematica 1" in bundle_content, "Analisi preset missing in bundle"
    assert "Dispense Teoria: Geometria e Algebra Lineare" in bundle_content, "Geometria preset missing in bundle"
    print("Test Point 11 (Side-by-side PDF Viewer / Split View) passed successfully!")

if __name__ == "__main__":
    test_point11()
