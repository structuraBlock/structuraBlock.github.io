class SimpleArray:
    def __init__(self, data):
        self.data = data

    def __getitem__(self, index):
        return self.data[index]

    def __setitem__(self, index, value):
        self.data[index] = value

    def __len__(self):
        return len(self.data)
    
def zeros(shape, dtype=int):
    """Create an array filled with zeros."""
    if isinstance(shape, int):
        return [0] * shape
    elif isinstance(shape, tuple):
        if len(shape) == 1:
            return [0] * shape[0]
        elif len(shape) == 2:
            return [[0] * shape[1] for _ in range(shape[0])]
    else:
        raise ValueError("Shape must be an integer or a tuple of integers.")

def count_nonzero(arr):
    """Count non-zero elements in an array."""
    return sum(1 for elem in flatten(arr) if elem != 0)

def flatten(lst):
    """Flatten a nested list."""
    for elem in lst:
        if isinstance(elem, list):
            yield from flatten(elem)
        else:
            yield elem

def flip(arr, axis):
    """Flip an array along a given axis."""
    if axis == 0:
        return [row[::-1] for row in arr]
    elif axis == 1 and isinstance(arr[0], list):
        return [col for col in zip(*arr)][::-1]
    else:
        raise ValueError("Axis out of bounds or not applicable.")