import { GoogleGenAI } from "@google/genai";

// Note: In a real production app, API calls should go through a backend to hide the key.
// For this demo structure, we use the env var directly as requested.
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const runPythonCode = async (code: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Error: API Key missing. Cannot execute code.";

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
You are a Python Code Interpreter. 
Execute the following Python code and return ONLY the output.
If there are syntax errors or runtime errors, return the error message clearly.
Do not provide markdown formatting like \`\`\`, just the raw text output.
Do not explain the code, just run it.

Code:
${code}
`;

    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "No output returned.";
  } catch (error: any) {
    console.error("Gemini execution error:", error);
    return `Execution Error: ${error.message || "Unknown error"}`;
  }
};

export const getTutorResponse = async (
  userQuery: string, 
  context: string, 
  history: { role: string, text: string }[]
): Promise<string> => {
  const client = getClient();
  if (!client) return "I'm sorry, I can't help right now (API Key missing).";

  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `You are Erick Wambura's AI Assistant, "WamburaBot".
    You are friendly, encouraging, and an expert Python Tutor.
    Your goal is to help the student understand Python concepts, fix their code, or explain errors.
    Keep answers concise but helpful. Use analogies related to Tanzania or daily life where appropriate.
    Context: The user is currently looking at: ${context}.
    `;

    const prompt = `${systemInstruction}\n\nUser History: ${JSON.stringify(history)}\n\nCurrent Question: ${userQuery}`;

    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Tutor error:", error);
    return "Sorry, I'm having trouble thinking right now.";
  }
};

export const checkCodeSolution = async (userCode: string, taskDescription: string): Promise<{correct: boolean, feedback: string}> => {
    const client = getClient();
    if (!client) return { correct: false, feedback: "API Key missing" };

    try {
        const prompt = `
        Task: ${taskDescription}
        User Code:
        ${userCode}

        Analyze if the user's code correctly solves the task.
        Return a JSON object with "correct" (boolean) and "feedback" (string).
        The feedback should be encouraging and helpful.
        `;

        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text);
    } catch (e) {
        return { correct: false, feedback: "Could not verify code automatically." };
    }
}

export const analyzeCode = async (code: string): Promise<string> => {
    const client = getClient();
    if (!client) return "API Key missing.";

    try {
        const prompt = `
        You are a Senior Python Code Reviewer.
        Analyze the following code for:
        1. PEP 8 Style Compliance
        2. Code Efficiency & Best Practices
        3. Potential Bugs
        4. Pythonic Improvements

        Provide the output in a structured, readable format (Markdown is okay).
        Be constructive and encouraging.

        Code:
        ${code}
        `;

        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || "No feedback generated.";
    } catch (e) {
        return "Could not complete code review.";
    }
};
