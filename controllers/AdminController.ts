import { Request, Response, NextFunction } from 'express';
import { CreateVandorInput } from '../dto';
import { Vandor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';

export const CreateVandor = async (req:Request, res:Response, next:NextFunction) => {

    const { name, ownerName, pincode, foodType, address, password, phone, email } = <CreateVandorInput>req.body;

    const existedVandor = await Vandor.findOne({ email });

    if(existedVandor) {
        return res.json({ message: "Vandor with this email already exists" })
    }
    
    const salt = await GenerateSalt();
    const newPassword = await GeneratePassword(password, salt);

    const createdVandor = await Vandor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: newPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
    })

    return res.json(createdVandor);

}

export const GetVandor = async (req:Request, res:Response, next:NextFunction) => {
    
}

export const GetVandorById = async (req:Request, res:Response, next:NextFunction) => {
    
}