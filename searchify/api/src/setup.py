from setuptools import setup

setup(
    name='hiExpanAPI',
    version='1.0',
    author="Juan Luis Filgueiras Rilo",
    author_email="juan.filgueiras.rilo@udc.es",
    description="HiExpan Framework API for taxonomy construction and retrieval",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)