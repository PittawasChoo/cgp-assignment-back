# CGP Thailand Assignment: Webboard mini project
CGP Thailand Assignment: Webboard mini project developed with nestjs connected with firebase database

## Pre-requisites
- Install [Node.js](https://nodejs.org/en/)

# Getting started
- Clone the repository
```
git clone https://github.com/PittawasChoo/cgp-assignment-back.git
```
- Download credential folder that will be attached in the hand in email 
- In credential-files/cgp-assignment-back, There are 2 credential files for this repository in there. Bring them in the repository folder that cloned from first step
- If you cannot see .env file in the that folder in mac, try cmd + shft + . to show all hidden files
- Install dependencies
```
cd cgp-assignment-back
npm install
```
- Run the project
```
npm run start:dev
```
- Once the log show "Nest application successfully started", the back-end is ready to use.

## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **node_modules** | Contains all npm dependencies. |
| **dist** | Contains compiled files after running npm run build |
| **src** | Contains source code that will be compiled. |
| **src/auth** | Contains functions to handle event relate with authentication |
| **src/firebase**| Contains functions to deal with database side (firebase) |
| **src/posts**| Contains functions to handle event relate with posts |
| **src**/main.ts | Top level function file for the porject |
| .env | Contains all secret configurations |
| firebase-admin-sdk.json | Contains all firebase secret configurations |
| package.json | Contains npm dependencies |

## APIs
All APIs in this project
```
/auth
    /signin [POST] : Sign in - will return jwt
/post
    / [GET]  : Get all posts
    / [POST] : Add new post to database
    /:postId [GET] : Get post detail by post id
    /:postId [PATCH] : Edit specific post detail
    /:postId [DELETE] : Delete specific post
/my-post
    / [GET]  : Get all posts of current user id
/comment
    / [POST] : Add new comment into collection of a post
```

## Dependencies

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| firebase-admin | Used for firebase database connection |
| passport | Used for handle jwt |
| passport-jwt | Used for handle jwt |

