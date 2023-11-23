import { Request, Response, NextFunction } from 'express';
import { EditVandorInput, VandorLoginInputs } from '../dto';
import { FindVandor } from './AdminController';
import { GenerateSignature, ValidatePassword } from '../utility';

export const VandorLogin = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = <VandorLoginInputs>req.body

    const vandor = await FindVandor('', email);

    if(vandor){
        const validation = await ValidatePassword(password, vandor.password, vandor.salt);

        if(validation){
            const signature = GenerateSignature({ 
                _id: vandor._id, 
                email: vandor.email,
                foodTypes: vandor.foodType,
                name: vandor.name
             })
            return res.json(signature);
        } else {
            return res.json({ message: 'Password is not valid' })
        }
    }

    return res.json({ message: 'Login credential not valid' });
}

export const GetVandorProfile = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if(user) {
        const vandor = await FindVandor(user._id);

        return res.json(vandor);
    }

    return res.json({ message: "Vandor not found" });

}

export const UpdateVandorProfile = async (req: Request, res: Response, next: NextFunction) => {

    const { name, address, phone, foodTypes } = <EditVandorInput>req.body;
    const user = req.user;

    if(user) {
        const vandor = await FindVandor(user._id);

        if(vandor) {
            name ? vandor.name = name : false;
            address ? vandor.address = address : false;
            phone ? vandor.phone = phone : false;
            foodTypes ? vandor.foodType = foodTypes : false;

            const savedVandor = await vandor.save();
            return res.json(savedVandor); 
        }
        return res.json(vandor);
    }

    return res.json({ message: "Vandor not found" });

}

export const UpdateVandorService = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if(user) {
        const vandor = await FindVandor(user._id);

        if(vandor) {
            vandor.serviceAvailable = !vandor.serviceAvailable;
            const savedVandor = await vandor.save();
            return res.json(savedVandor); 
        }

    }

    return res.json({ message: "Vandor not found" });
}