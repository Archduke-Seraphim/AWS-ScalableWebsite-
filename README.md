AWS Scalable Student Records Web Application

This project demonstrates how to build and deploy a scalable student records web application on AWS using EC2, RDS (MySQL), Application Load Balancer, and Auto Scaling Groups. The guide walks through setting up a complete cloud architecture using a custom VPC, public and private subnets, and deploying a dynamic Node.js web application connected to a database.

Project functionality includes:
- User sign up and login with username and password
- Ability to view, add, and edit personal student records
- Interaction with a MySQL database hosted on Amazon RDS
- Automatic scaling of backend resources using EC2 Auto Scaling and a Load Balancer

Note: This project was built within an AWS lab environment with some limitations. Due to these restrictions, the application is not production-grade. Secrets had to be hardcoded instead of using AWS Secrets Manager, and HTTPS on port 443 could not be configured due to the inability to register a public domain name.

Technologies used:
- AWS EC2 for virtual machines running Ubuntu and Node.js backend
- AWS RDS for MySQL database
- AWS VPC for isolated networking and subnet control
- AWS Application Load Balancer for distributing traffic
- AWS Auto Scaling for handling dynamic user load
- Node.js and Express for backend application logic
- HTML and CSS for the frontend interface

Directory structure:
public/               - Static HTML and CSS files
db.js                 - MySQL database connection logic
index.js              - Express server and route handlers
package.json          - Node.js project dependencies


Make sure to update db.js with your own MySQL credentials and connection settings.

Deployment steps and architecture diagrams are documented in the accompanying project PDF file.

All project code is available on GitHub and can be copied or reused from the following repository:
https://github.com/bmilanx0/AWS-ScalableWebsite-

This repository was created for learning purposes to demonstrate how to build and scale a web application on AWS infrastructure.
