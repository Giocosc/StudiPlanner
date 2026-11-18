def test_point18():
    with open("bundle.js", "r", encoding="utf-8") as f:
        bundle_content = f.read()

    assert "BurndownChart" in bundle_content, "BurndownChart missing in bundle"
    assert "Grafico Burndown: Ore Residue vs Linea Ideale" in bundle_content, "Burndown header missing in bundle"
    assert "Traiettoria Ideale" in bundle_content, "Ideal trajectory legend missing in bundle"
    assert "In Anticipo" in bundle_content, "Ahead badge missing in bundle"
    print("Test Point 18 (Agile/Scrum Burndown Hours Chart) passed successfully!")

if __name__ == "__main__":
    test_point18()
