import { Request, Response, NextFunction } from 'express';
import { CreateVandorInput } from '../dto';
import { Vandor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';


export const FindVandor = async(id: string | undefined, email?: string) => {

    if(email) {
        return await Vandor.findOne({ email: email });
    } else {
        return await Vandor.findById(id);
    }
}

export const CreateVandor = async (req:Request, res:Response, next:NextFunction) => {

    const { name, ownerName, pincode, foodType, address, password, phone, email } = <CreateVandorInput>req.body;

    const existedVandor = await FindVandor('', email)

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
        foods: [],
    })

    return res.json(createdVandor);

}

export const GetVandor = async (req:Request, res:Response, next:NextFunction) => {
    
    const vandors = await Vandor.find();

    if(vandors) {
        return res.json(vandors);
    }

    return res.json({ message: 'Vandors data not available' })

}

export const GetVandorById = async (req:Request, res:Response, next:NextFunction) => {

    const vandorId = req.params.id;
    
    const vandor = await FindVandor(vandorId);

    if(vandor) {
        return res.json(vandor);
    }

    return res.json({ message: 'Vandor data not available' })

}