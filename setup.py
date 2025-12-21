from setuptools import setup, find_packages
import os

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name='pluto-ai',  
    version='1.0.0',
    author='0xSaikat',
    author_email='contact@hackbit.org',
    description='AI-powered code security vulnerability scanner',
    long_description=long_description,
    long_description_content_type='text/markdown',
    url='https://github.com/0xsaikat/pluto',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'click>=8.0.0',
        'anthropic>=0.18.0',
        'openai>=1.0.0',
        'requests>=2.28.0',
        'GitPython>=3.1.0',
        'reportlab>=4.0.0',
    ],
    entry_points={
        'console_scripts': [
            'pluto=pluto.cli:cli',
        ],
    },
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'Topic :: Security',
        'Topic :: Software Development :: Quality Assurance',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.7',
    keywords='security vulnerability scanner code-analysis ai pluto static-analysis',
    project_urls={
        'Bug Reports': 'https://github.com/0xsaikat/pluto/issues',
        'Source': 'https://github.com/0xsaikat/pluto',
        'Website': 'https://hackbit.org',
    },
)
