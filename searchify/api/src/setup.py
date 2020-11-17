from setuptools import setup

setup(
    name='searchifyAPI',
    version='1.0',
    authors="Juan Luis Filgueiras Rilo & Jorge Juan Gabín Brenlla",
    author_emails="juan.filgueiras.rilo@udc.es & jorge.gabin@udc.es",
    description="Searchify API for Spotify searchs",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)