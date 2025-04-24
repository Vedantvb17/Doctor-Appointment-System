import bcrypt from 'bcrypt'
import validator from "validator"
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'

// API for adding doctor
const addDoctor = async (req,res) => {
    
    try {
        const{name, email, password, speciality, degree, expreience, about, fees, address} = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !expreience || !about || !fees || !address){
            return res.json({success:false, message: "Missing Details"})
        }

        //vaalidating email format
        if(!validator.isEmail(email)){
            return res.json({success:false, message: "Please enter a valid Email"})
        }

        //Validator Strong Password
        if(password.length < 8){
            return res.json({success:false, message: "Please enter a strong password"})
        }

        //hashing doctors password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name, 
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            expreience, 
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now() 
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true, message:"Doctor Added"})

    } catch (error) {
        console.log(error)
        res.json({success:false, messsage:error.message})
    }
}

export {addDoctor}