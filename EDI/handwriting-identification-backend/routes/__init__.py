# This file makes the routes directory a package
from . import cases, samples, matching, persons, training
try:
    from . import auth  # optional until created
except Exception:
    auth = None
