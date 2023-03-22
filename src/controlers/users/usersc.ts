import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { creatData, getAllData } from "../../utils/users/indexU";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// C-O-N-T-R-O-L-E-R FUNCTION
//
const path = require('path');
const saltRounds = 10;

//FUNCTION FOR GET ALL USERS COMING FROM THE getAllData Function IN UTILITY
// GET REQUEST FOR WHEN USER LOGS IN
export const getAUserForm = (req: Request, res: Response, next: NextFunction) => { 
    res.render("login");
}
export const getAUser = (req: Request, res: Response, next: NextFunction) =>
{
    const allUsers = getAllData("users.json");

    const { password, Username } = req.body;

    const existingUserName = allUsers.find((e: any) => e.UserName === Username)
    
    if (!existingUserName ) {
        return res.send({
        message: "THIS USER DOSE NOT EXIST"
        });
    }

    allUsers.forEach((e: any) => {
        if (Username === e.UserName) {
            // bcrypt.compare(password, e.password, function (err, result) {
                
            const result = bcrypt.compareSync(password, e.password); 
            if (result) {
                    const token = jwt.sign(e, 'shhhhh');
                    const data = {
                        "message": "login successful",
                        "logedUser": e,
                        "Token": token
                    };
                    res.redirect("/book/getAllBooks");
                } else {
                    res.send("error")
                }
            // });
        }
    });
}

//FUNCTION FOR CREATING users COMING FROM THE creatData Function IN UTILITY

export const createUserDataForm = (req: Request, res: Response, next: NextFunction) => {
res.render("signup")
}
export const createUserData = (req: Request, res: Response, next: NextFunction) => {
    const allUsers = getAllData("users.json");

    const existingUserName = allUsers.find((e: any) => e.UserName === req.body.UserName)
    const existingUserMail = allUsers.find((e: any) => e.Email === req.body.email)
    if (existingUserName || existingUserMail) {
        return res.send({
            message: `User with the Name ${req.body.UserName}  And Email ${req.body.email} already exists`
        });
    }
    const { password, UserName, email } = req.body;

    // bcrypt.hash(password, saltRounds, (err, hash) => {
    
        // if (err){
        //     console.log(err);
        //     return err;
        // }
        const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(password, salt);
        const newChunk = {
        "id": uuidv4(),
        "UserName": UserName,
        "Email": email,
        "password": hash,
        "createdAt": new Date(),
        "updatedAt": new Date()
        }
        const token = jwt.sign(newChunk, 'shhhhh');
        allUsers.push(newChunk)
        creatData("users.json", allUsers);
        const wittoken = {
            "allUsers": allUsers,
            "token": token
        }
        res.redirect("/book/getAllBooks");
    // });




    
}