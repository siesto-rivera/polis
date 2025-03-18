# Tests for Pol.is Math Python Conversion

This directory contains tests for the Python implementation of the Pol.is math components.

## Running Tests

To run all tests:

```bash
cd python_conversion
python -m pytest tests/
```

To run a specific test file:

```bash
python -m pytest tests/test_named_matrix.py
```

To run a specific test class or function:

```bash
python -m pytest tests/test_named_matrix.py::TestNamedMatrix
python -m pytest tests/test_named_matrix.py::TestNamedMatrix::test_update
```

## Test Coverage

To run tests with coverage:

```bash
python -m pytest --cov=polismath tests/
```

## Test Structure

- `test_named_matrix.py`: Tests for the NamedMatrix data structure
- `test_pca.py`: Tests for the PCA implementation
- `test_clusters.py`: Tests for the clustering implementation

## Adding Tests

When adding new components to the Python implementation, please also add corresponding tests to verify that the implementation matches the behavior of the original Clojure code.