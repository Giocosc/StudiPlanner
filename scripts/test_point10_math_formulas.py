def test_point10():
    with open("bundle.js", "r", encoding="utf-8") as f:
        bundle_content = f.read()

    assert "MathFormulaDrawer" in bundle_content, "MathFormulaDrawer missing in bundle"
    assert "Formulario [F2]" in bundle_content, "Formulario button missing in bundle"
    assert "F2" in bundle_content, "F2 shortcut missing in bundle"
    assert "Grassmann" in bundle_content, "Grassmann formula missing in bundle"
    assert "Sviluppi di Maclaurin" in bundle_content, "Maclaurin formula missing in bundle"
    assert "Invarianti Metrici" in bundle_content, "Conic invariants missing in bundle"
    print("Test Point 10 (Math Formula Drawer) passed successfully!")

if __name__ == "__main__":
    test_point10()
