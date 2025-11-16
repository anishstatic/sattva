import OpenAI from "openai";
// 🛠️ FIX: Added the .js extension for the local relative import.
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs';
import * as pdf from 'pdf-parse';
//import  pdf  from 'pdf-parse';
//import pdf from 'pdf-parse/lib/pdf-parse.js';

const AI = new OpenAI({
 apiKey: process.env.GEMINI_API_KEY,
 baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
 try {
 // NOTE: Assuming req.auth() is correctly set up by Clerk middleware and returns an object with userId
 const { userId } = req.auth(); 
 const { prompt, length } = req.body;
 const plan = req.plan;
 const free_usage = req.free_usage;

 if (plan !== "premium" && free_usage >= 10) {
 return res.json({
  success: false,
 message: "Limit reached. Upgrade to continue.",
 });
 }

const response = await AI.chat.completions.create({
 model: "gemini-2.0-flash",
 messages: [
  {
    role: "user",
    content: prompt,
  },
 ],
 temperature: 0.7,
 max_tokens: length,
});

 const content = response.choices[0].message.content

 // Using the imported 'sql' object to execute the database query
 await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

 if(plan !== 'premium'){
 await clerkClient.users.updateUserMetadata(userId,{
  privateMetadata:{
   free_usage:free_usage + 1
  }
 })
 }

 res.json({ success: true, content });

 } catch (error) {
  console.log(error.message);
  res.json({ success: false, message: error.message });
 }
}

export const generateBlogTitle = async (req, res) => {
 try {
 // NOTE: Assuming req.auth() is correctly set up by Clerk middleware and returns an object with userId
 const { userId } = req.auth(); 
 const { prompt } = req.body;
 const plan = req.plan;
 const free_usage = req.free_usage;

 if (plan !== "premium" && free_usage >= 10) {
 return res.json({
  success: false,
 message: "Limit reached. Upgrade to continue.",
 });
 }

const response = await AI.chat.completions.create({
 model: "gemini-2.0-flash",
 messages: [
  {
    role: "user",
    content: prompt,
  },
 ],
 temperature: 0.7,
 max_tokens: 100,
});

 const content = response.choices[0].message.content

 // Using the imported 'sql' object to execute the database query
 await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

 if(plan !== 'premium'){
 await clerkClient.users.updateUserMetadata(userId,{
  privateMetadata:{
   free_usage:free_usage + 1
  }
 })
 }

 res.json({ success: true, content });

 } catch (error) {
  console.log(error.message);
  res.json({ success: false, message: error.message });
 }
}

export const aiDictionary = async (req, res) => {
 try {
 // NOTE: Assuming req.auth() is correctly set up by Clerk middleware and returns an object with userId
 const { userId } = req.auth(); 
 const { prompt } = req.body;
 const plan = req.plan;
 const free_usage = req.free_usage;

 if (plan !== "premium" && free_usage >= 10) {
 return res.json({
  success: false,
 message: "Limit reached. Upgrade to continue.",
 });
 }

const response = await AI.chat.completions.create({
 model: "gemini-2.0-flash",
 messages: [
  {
    role: "user",
    content: prompt,
  },
 ],
 temperature: 0.7,
 max_tokens: 100,
});

 const content = response.choices[0].message.content

 // Using the imported 'sql' object to execute the database query
 await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'ai-dictionary')`;

 if(plan !== 'premium'){
 await clerkClient.users.updateUserMetadata(userId,{
  privateMetadata:{
   free_usage:free_usage + 1
  }
 })
 }

 res.json({ success: true, content });

 } catch (error) {
  console.log(error.message);
  res.json({ success: false, message: error.message });
 }
}


export const generateImage = async (req, res) => {
 try {
 // NOTE: Assuming req.auth() is correctly set up by Clerk middleware and returns an object with userId
 const { userId } = req.auth(); 
 const { prompt, publish } = req.body;
 const plan = req.plan;


 if (plan !== "premium") {
 return res.json({
  success: false,
 message: "This feature is only available for Premium subscriptions",
 });
 }

 const formData = new FormData()
 formData.append('prompt', prompt)
 const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
    headers:{
        'x-api-key': process.env.CLIPDROP_API_KEY,
    },
    responseType: 'arraybuffer',
 })

 const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

 const {secure_url} = await cloudinary.uploader.upload(base64Image)

 // Using the imported 'sql' object to execute the database query
 await sql` INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false })`;


 res.json({ success: true, content: secure_url });

 } catch (error) {
  console.log(error.message);
  res.json({ success: false, message: error.message });
 }
}

export const removeImageBackground = async (req, res) => {
 try {
 // NOTE: Assuming req.auth() is correctly set up by Clerk middleware and returns an object with userId
 const { userId } = req.auth(); 
 const  image  = req.file;
 const plan = req.plan;


 if (plan !== "premium") {
 return res.json({
  success: false,
 message: "This feature is only available for Premium subscriptions",
 });
 }

 const {secure_url} = await cloudinary.uploader.upload(image.path, {
  transformation:[
    {
      effect: 'background_removal',
      background_removal: 'remove_the_background'
    }
  ]
 })

 // Using the imported 'sql' object to execute the database query
 await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;


 res.json({ success: true, content: secure_url });

 } catch (error) {
  console.log(error.message);
  res.json({ success: false, message: error.message });
 }
}

export const removeImageObject = async (req, res) => {
try {
  const { userId } = req.auth(); 
  const { object } = req.body; 
  const image = req.file; // This MUST be populated by your middleware
  const plan = req.plan;

  // 1. Permission Check (Returns 403 Forbidden)
  if (plan !== "premium") {
    return res.json({ 
      success: false,
      message: "This feature is only available for Premium subscriptions",
    });
  }

  

  // If checks pass, proceed
  const {public_id} = await cloudinary.uploader.upload(image.path)

  const imageUrl = cloudinary.url(public_id, {
    transformation:[{
     effect: `gen_remove: ${object}`
    }],
    resource_type: 'image'
  })

  // 4. Database Fix: Save the final URL and correct prompt
  await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

  res.json({ success: true, content: imageUrl });

} catch (error) {
  console.log(error.message);
  // Use 500 for unhandled errors
  res.json({ success: false, message: error.message }); 
}
}

export const resumeReview = async (req, res) => {
    // Variable to hold the file path for cleanup, initialized to null
    let resumePath = null;
    const resume = req.file;

    try {
        const { userId } = req.auth();
        const plan = req.plan;

        // CRITICAL CHECK 1: Ensure the file was actually uploaded by the middleware
        if (!resume || !resume.path) {
            return res.status(400).json({
                success: false,
                message: "Resume file is missing. Please ensure you are uploading a file.",
            });
        }
        
        // Store the path now to ensure cleanup happens later
        resumePath = resume.path;

        // Check 2: Premium plan access
        if (plan !== "premium") {
            return res.json({
                success: false,
                message: "This feature is only available for Premium subscriptions",
            });
        }

        // Check 3: File size validation
        if (resume.size && resume.size > 5 * 1024 * 1024) { 
            return res.json({
                success: false,
                message: "File size should be less than 5MB"
            });
        }

        // 1. Read the file buffer (Synchronous read is fine for small files)
        const dataBuffer = fs.readFileSync(resume.path);
        
        // 2. Parse the PDF buffer
        // 🌟 FINAL FIX: Use .default to access the function when importing CJS modules in an ESM environment
        const pdfData = await pdf.default(dataBuffer); 

        const prompt = `Review the following resume and provide constructive feedback on its strength, weakness, and areas for improvement. Resume Content: \n\n${pdfData.text}`

        // 3. Call the AI service
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{
                role: "user",
                content: prompt,
            }, ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content

        // 4. Save to database
        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

        // 5. Send success response
        res.json({ success: true, content });

    } catch (error) {
        console.error("Resume Review Server Error:", error.message);
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    } finally {
        // 🚨 CRITICAL: Clean up the temporary file created by the upload middleware.
        if (resumePath) {
            fs.unlink(resumePath, (err) => {
                if (err) console.error("Failed to delete temp file:", err);
            });
        }
    }
}