import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { VandorPayload } from "../dto";
import { APP_SECRET } from "../config";
import { AuthPayload } from "../dto/Auth.dto";

export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
}

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}

export const ValidatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
    return await GeneratePassword(enteredPassword, salt) === savedPassword;
}

export const GenerateSignature = (payload: VandorPayload) => {
    return jwt.sign(payload, APP_SECRET, { expiresIn: '1d' });
}

export const ValidateSignature = async(req: Request) => {
    try {
        const signature = req.get('Authorization');
    
        if(signature) {
            const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET) as AuthPayload;
    
            req.user = payload;
    
            return true;
        }
    } catch (error) {
        return false;
    }
}