# COMP3005_Project
Project repository for COMP 3005:
This application is a fictional online book store called Look Inna Book 

To watch a demo video I've prepared, visit this link: https://www.youtube.com/watch?v=rzAQdEdl83g

To demo the application as customer, login with credentials:

user: testcustomer

pass: testcustomer

To demo the appllcation as staff, login with credentials: 

user: teststaff

pass: teststaff

Alternatively: create a new account. 

## Running on Localhost

To run this project locally, clone this repository and add a database connection in a .env file as specified in
the .env.example file. The DDl.sql and insertion.sql files can be used to configure a local database to have all the tables required for the application + content.  

Then, run the following commands:

1. In the root directory of the project: $npm start
2. In a new terminal, in the interface directory: $npm start

This will start the server side code first, and then runs the front-end application. It should open automatically in your default browser. 
