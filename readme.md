# Expense Tracker
A web application for users to create, read, update, delete expense records.


### Features
Users can
- register and login with your email or Facebook account to create your personal expense tracker
- add new expense records with five default categories
- read all records or select an category and get the total or subtotal amount
- edit and delete expense


### How to use?

#### Run at Heroku
View the website at: https://ac3-expense-tracker.herokuapp.com/

Register an account with your email or Facebook account, or login with seed users shown below.

#### Run at local server
1. Clone this repository with terminal:
```$ git clone https://github.com/smilingfroggy/AC2-3-Restaurant-List.git```

2. Install packages:```$ npm install ```

3. Insert categories, users, and records seeder ```$ npm run seed```

4. Run it ```$ npm run dev```

5. View the website at: http://localhost:3000

6. Register an account or login with seed users and experience the web app


### Seeder information
- User1: 
  Email: user1@example.com
  Password: 12345678

- User2:
  Email: user2@example.com 
  Password: 23456789


### Packages 
- Node.js
- MongoDB
- Mongoose
- Express.js
- Express-handlebars
- Express-session
- bcryptjs
- connect-flash
- dotenv
- method-override
- passport
- passport-facebook
- passport-local