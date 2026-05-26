"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function generateJobDescription(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    
    const result = await model.generateContent(`
      You are an expert freelance marketplace assistant (like Upwork or NovaLance).
      Write a professional, detailed job description based on the following prompt:
      "${prompt}"
      
      Format the response cleanly without markdown headers, just the content.
    `)
    
    return { success: true, text: result.response.text() }
  } catch (error) {
    console.error("AI Generation Error", error)
    return { success: false, text: "Could not generate job description at this time." }
  }
}

export async function analyzeProposals(proposalsData: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    
    const result = await model.generateContent(`
      You are an AI hiring assistant for NovaLance.
      Review the following JSON data containing proposals for a job:
      ${proposalsData}
      
      Give a brief (2-3 sentence) recommendation on who the best fit is and why.
    `)
    
    return { success: true, text: result.response.text() }
  } catch (error) {
    console.error("AI Generation Error", error)
    return { success: false, text: "Could not analyze proposals at this time." }
  }
}
