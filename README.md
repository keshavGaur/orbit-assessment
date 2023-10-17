# Orbitshift assessment
Script to remove deduplication

## USAGE:

### Prerequisites
1. Download & Install Nodejs https://nodejs.org/en/ version 14.19.1
1. Make sure you are using 14.19.1 version of Nodejs & 6.14.16 of npm version
1. Check Node/NPM version by running commands node -v & npm -v respectively
1. VS Code IDE https://code.visualstudio.com/download (Recommended for Nodejs development not required)
1. create schema in postgre using db files in ./schema folder
1. import csv using COPY jobs_raw (id, source_type, title) 
FROM 'C:\<user>\assignment_job_titles.csv' CSV HEADER DELIMITER ',';
1. CREATE EXTENSION fuzzystrmatch SCHEMA public;

### Service - One Time
1. git clone https://github.com/keshavGaur/orbit-assessment.git
1. cd/chdir to install directory/folder ("orbit-assessment")
1. npm install

### Service - Each time
1. npm start start

## Dockerize
1. Make sure that DB allows connections from all ips(or docker ip)
1. Run 