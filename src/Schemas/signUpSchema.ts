import { z } from "zod";

export const usernameValidation=z
       .string()
       .min(2,"username must be atleast of 2 character")
       .max(20,"username must not be more than 20 characters")
       .regex(/^[a-zA-Z0-9._-]{3,20}$/,"username must not contain special characters")


export const signupSchema=z.object({
    username:usernameValidation,
    email:z.string()
          .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"enter the correct email address")
          .email({message:"Invalid email address"}),
    password:z.string()
            .min(6,{message:"password should be of minimum 6 characters"})
            .max(20,{message:"password should be of max length 20"})
});
     
