"""
Named Matrix implementation for Pol.is math module.

This module provides a data structure for matrices with named rows and columns,
specifically optimized for the Pol.is voting data representation.
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Union, Optional, Tuple, Any, Set


class IndexHash:
    """
    Maintains an ordered index of names with fast lookup.
    Similar to the Clojure IndexHash implementation.
    """
    
    def __init__(self, names: Optional[List[Any]] = None):
        """
        Initialize an IndexHash with optional initial names.
        
        Args:
            names: Optional list of initial names
        """
        self._names = [] if names is None else list(names)
        self._index_hash = {name: idx for idx, name in enumerate(self._names)}
        
    def get_names(self) -> List[Any]:
        """Return the ordered list of names."""
        return self._names.copy()
    
    def next_index(self) -> int:
        """Return the next index value that would be assigned."""
        return len(self._names)
    
    def index(self, name: Any) -> Optional[int]:
        """
        Get the index for a given name, or None if not found.
        
        Args:
            name: The name to look up
            
        Returns:
            The index if found, None otherwise
        """
        return self._index_hash.get(name)
    
    def append(self, name: Any) -> 'IndexHash':
        """
        Add a new name to the index.
        
        Args:
            name: The name to add
            
        Returns:
            A new IndexHash with the added name
        """
        if name in self._index_hash:
            return self
            
        new_index = IndexHash(self._names)
        new_index._names.append(name)
        new_index._index_hash[name] = len(new_index._names) - 1
        return new_index
    
    def append_many(self, names: List[Any]) -> 'IndexHash':
        """
        Add multiple names to the index.
        
        Args:
            names: List of names to add
            
        Returns:
            A new IndexHash with the added names
        """
        result = self
        for name in names:
            result = result.append(name)
        return result
    
    def subset(self, names: List[Any]) -> 'IndexHash':
        """
        Create a subset of the index with only the specified names.
        
        Args:
            names: List of names to include in the subset
            
        Returns:
            A new IndexHash containing only the specified names
        """
        # Filter names that exist in the current index
        valid_names = [name for name in names if name in self._index_hash]
        return IndexHash(valid_names)
    
    def __len__(self) -> int:
        """Return the number of names in the index."""
        return len(self._names)
    
    def __contains__(self, name: Any) -> bool:
        """Check if a name is in the index."""
        return name in self._index_hash


class NamedMatrix:
    """
    A matrix with named rows and columns.
    
    This is the Python equivalent of the Clojure NamedMatrix implementation,
    using pandas DataFrame as the underlying storage.
    """
    
    def __init__(self, 
                 matrix: Optional[Union[np.ndarray, pd.DataFrame]] = None,
                 rownames: Optional[List[Any]] = None,
                 colnames: Optional[List[Any]] = None):
        """
        Initialize a NamedMatrix with optional initial data.
        
        Args:
            matrix: Initial matrix data (numpy array or pandas DataFrame)
            rownames: List of row names
            colnames: List of column names
        """
        # Initialize row and column indices
        self._row_index = IndexHash(rownames)
        self._col_index = IndexHash(colnames)
        
        # Initialize the matrix data
        if matrix is None:
            # Create an empty DataFrame
            self._matrix = pd.DataFrame(
                index=self._row_index.get_names(),
                columns=self._col_index.get_names()
            )
        elif isinstance(matrix, pd.DataFrame):
            # If DataFrame is provided, use it directly
            self._matrix = matrix.copy()
            # Update indices if provided
            if rownames is not None:
                self._matrix.index = rownames
            if colnames is not None:
                self._matrix.columns = colnames
        else:
            # Convert numpy array to DataFrame
            rows = rownames if rownames is not None else range(matrix.shape[0])
            cols = colnames if colnames is not None else range(matrix.shape[1])
            self._matrix = pd.DataFrame(
                matrix,
                index=rows,
                columns=cols
            )
    
    @property
    def matrix(self) -> pd.DataFrame:
        """Get the underlying DataFrame."""
        return self._matrix
    
    @property
    def values(self) -> np.ndarray:
        """Get the matrix as a numpy array."""
        return self._matrix.values
    
    def rownames(self) -> List[Any]:
        """Get the list of row names."""
        return self._row_index.get_names()
    
    def colnames(self) -> List[Any]:
        """Get the list of column names."""
        return self._col_index.get_names()
    
    def get_row_index(self) -> IndexHash:
        """Get the row index object."""
        return self._row_index
    
    def get_col_index(self) -> IndexHash:
        """Get the column index object."""
        return self._col_index
    
    def update(self, 
               row: Any, 
               col: Any, 
               value: Any) -> 'NamedMatrix':
        """
        Update a single value in the matrix, adding new rows/columns as needed.
        
        Args:
            row: Row name
            col: Column name
            value: New value
            
        Returns:
            A new NamedMatrix with the updated value
        """
        # Make a copy of the current matrix
        new_matrix = self._matrix.copy()
        
        # Add row if it doesn't exist
        if row not in new_matrix.index:
            new_matrix.loc[row] = np.nan
            new_row_index = self._row_index.append(row)
        else:
            new_row_index = self._row_index
            
        # Add column if it doesn't exist
        if col not in new_matrix.columns:
            new_matrix[col] = np.nan
            new_col_index = self._col_index.append(col)
        else:
            new_col_index = self._col_index
            
        # Update the value
        new_matrix.loc[row, col] = value
        
        # Create a new NamedMatrix with updated data
        result = NamedMatrix.__new__(NamedMatrix)
        result._matrix = new_matrix
        result._row_index = new_row_index
        result._col_index = new_col_index
        return result
    
    def update_many(self, 
                   updates: List[Tuple[Any, Any, Any]]) -> 'NamedMatrix':
        """
        Update multiple values in the matrix.
        
        Args:
            updates: List of (row, col, value) tuples
            
        Returns:
            A new NamedMatrix with the updated values
        """
        result = self
        for row, col, value in updates:
            result = result.update(row, col, value)
        return result
    
    def rowname_subset(self, rownames: List[Any]) -> 'NamedMatrix':
        """
        Create a subset of the matrix with only the specified rows.
        
        Args:
            rownames: List of row names to include
            
        Returns:
            A new NamedMatrix with only the specified rows
        """
        # Filter for rows that exist in the matrix
        valid_rows = [row for row in rownames if row in self._matrix.index]
        
        if not valid_rows:
            # Return an empty matrix with the same columns
            return NamedMatrix(
                pd.DataFrame(columns=self.colnames()),
                rownames=[],
                colnames=self.colnames()
            )
        
        # Create a subset of the matrix
        subset_df = self._matrix.loc[valid_rows]
        
        # Create a new NamedMatrix with the subset
        result = NamedMatrix.__new__(NamedMatrix)
        result._matrix = subset_df
        result._row_index = self._row_index.subset(valid_rows)
        result._col_index = self._col_index
        return result
    
    def colname_subset(self, colnames: List[Any]) -> 'NamedMatrix':
        """
        Create a subset of the matrix with only the specified columns.
        
        Args:
            colnames: List of column names to include
            
        Returns:
            A new NamedMatrix with only the specified columns
        """
        # Filter for columns that exist in the matrix
        valid_cols = [col for col in colnames if col in self._matrix.columns]
        
        if not valid_cols:
            # Return an empty matrix with the same rows
            return NamedMatrix(
                pd.DataFrame(index=self.rownames()),
                rownames=self.rownames(),
                colnames=[]
            )
        
        # Create a subset of the matrix
        subset_df = self._matrix[valid_cols]
        
        # Create a new NamedMatrix with the subset
        result = NamedMatrix.__new__(NamedMatrix)
        result._matrix = subset_df
        result._row_index = self._row_index
        result._col_index = self._col_index.subset(valid_cols)
        return result
    
    def get_row_by_name(self, row_name: Any) -> np.ndarray:
        """
        Get a row of the matrix by name.
        
        Args:
            row_name: The name of the row
            
        Returns:
            The row as a numpy array
        """
        if row_name not in self._matrix.index:
            raise KeyError(f"Row name '{row_name}' not found")
        return self._matrix.loc[row_name].values
    
    def get_col_by_name(self, col_name: Any) -> np.ndarray:
        """
        Get a column of the matrix by name.
        
        Args:
            col_name: The name of the column
            
        Returns:
            The column as a numpy array
        """
        if col_name not in self._matrix.columns:
            raise KeyError(f"Column name '{col_name}' not found")
        return self._matrix[col_name].values
    
    def zero_out_columns(self, colnames: List[Any]) -> 'NamedMatrix':
        """
        Set all values in the specified columns to zero.
        
        Args:
            colnames: List of column names to zero out
            
        Returns:
            A new NamedMatrix with zeroed columns
        """
        # Make a copy
        new_matrix = self._matrix.copy()
        
        # Zero out columns that exist
        valid_cols = [col for col in colnames if col in new_matrix.columns]
        for col in valid_cols:
            new_matrix[col] = 0
            
        # Create a new NamedMatrix with updated data
        result = NamedMatrix.__new__(NamedMatrix)
        result._matrix = new_matrix
        result._row_index = self._row_index
        result._col_index = self._col_index
        return result
    
    def inv_rowname_subset(self, rownames: List[Any]) -> 'NamedMatrix':
        """
        Create a subset excluding the specified rows.
        
        Args:
            rownames: List of row names to exclude
            
        Returns:
            A new NamedMatrix without the specified rows
        """
        exclude_set = set(rownames)
        include_rows = [row for row in self.rownames() if row not in exclude_set]
        return self.rowname_subset(include_rows)
    
    def __repr__(self) -> str:
        """
        String representation of the NamedMatrix.
        """
        return f"NamedMatrix(rows={len(self.rownames())}, cols={len(self.colnames())})"
    
    def __str__(self) -> str:
        """
        Human-readable string representation.
        """
        return (f"NamedMatrix with {len(self.rownames())} rows and "
                f"{len(self.colnames())} columns\n{self._matrix}")


# Utility functions

def create_named_matrix(matrix_data: Optional[Union[np.ndarray, List[List[Any]]]] = None,
                        rownames: Optional[List[Any]] = None,
                        colnames: Optional[List[Any]] = None) -> NamedMatrix:
    """
    Create a NamedMatrix from data.
    
    Args:
        matrix_data: Initial matrix data (numpy array or nested lists)
        rownames: List of row names
        colnames: List of column names
        
    Returns:
        A new NamedMatrix
    """
    if matrix_data is not None and not isinstance(matrix_data, np.ndarray):
        matrix_data = np.array(matrix_data)
    return NamedMatrix(matrix_data, rownames, colnames)