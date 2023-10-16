import csv using COPY jobs_raw (id, source_type, title) 
FROM 'C:\Keshav\assignment_job_titles.csv' CSV HEADER DELIMITER ',';

CREATE EXTENSION fuzzystrmatch SCHEMA public;

# Orbitshift assessment
Script to remove deduplication

## USAGE:

### Prerequisites
1. Download & Install Nodejs https://nodejs.org/en/ version 14.19.1
1. Make sure you are using 14.19.1 version of Nodejs & 6.14.16 of npm version
1. Check Node/NPM version by running commands node -v & npm -v respectively
1. VS Code IDE https://code.visualstudio.com/download (Recommended for Nodejs development not required)

### Service - One Time
1. git clone https://github.com/keshavGaur/orbit-assessment.git
1. cd/chdir to install directory/folder ("orbit-assessment")
1. npm install

### Service - Each time
1. npm start

## Dockerize
1. Run 