import { z } from "zod";

export const messageSchema=z.object({
    content:z.string()
             .min(10,{message:"message should be of minimum 10 characters"})
             .max(350,{message:"message should not be of more than 350 characters"})
})