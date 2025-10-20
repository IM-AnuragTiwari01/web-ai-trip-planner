import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// --- SECURITY WARNING REMAINS ---
// This approach still exposes the API key if run directly in the browser.
// Use a backend server for production deployment.
const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("VITE_GOOGLE_GEMINI_API_KEY is not set in the environment.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

const generationConfig = {
    temperature: 0.8,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
};

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// --- Updated PROMPT TEMPLATE ---
// Requesting explicit pricing (e.g., "$100 per night")
export const AI_PROMPT_TEMPLATE = `
Generate Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget.

Give me a list of {hotelCount} hotel options with: (give atleast 6 hotels and maximum 8)
- hotelName (string)
- hotelAddress (string)
- pricePerNightInUSD (string, e.g., "$100", "$150", "$200", etc.) 
- hotel image url (string)
- geo coordinates (object with latitude: number, longitude: number)
- rating (number)
- descriptions (string)

And suggest an itinerary with:
- placeName (string)
- place details (string)
- place Image url (string)
- geo coordinates (object with latitude: number, longitude: number)
- ticket pricing (string)
- time travel (string, estimated travel time)
- best time to visit (string)

Structure the entire response as a single JSON object with a root key "travelPlan". Ensure all keys and string values are enclosed in double quotes.
Example structure:
{
  "travelPlan": {
    "location": "{location}",
    "duration": "{totalDays} Days",
    "travelerType": "{traveler}",
    "budget": "{budget}",
    "hotelOptions": [ { "hotelName": "...", ... } ],
    "itinerary": [ { "day": 1, "theme": "...", "activities": [ { "placeName": "...", ... } ] } ]
  }
}
Respond only with the JSON object for this initial request. Subsequent responses might be conversational.
`;

/**
 * Helper function to replace placeholders in the template string.
 */
function fillPromptTemplate(template, values) {
  let filledPrompt = template;
  for (const key in values) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    filledPrompt = filledPrompt.replace(regex, values[key]);
  }
  return filledPrompt;
}

// --- NEW FUNCTIONS USING ChatSession ---

/**
 * Starts a new chat session and sends the initial travel plan request.
 * IMPORTANT: This function returns the session object AND the first response.
 * The calling component MUST store the session object to send further messages.
 *
 * @param {string} location - The travel destination.
 * @param {string | number} totalDays - The duration of the trip in days.
 * @param {string} traveler - The type of traveler (e.g., "Couple", "Solo", "Family").
 * @param {string} budget - The budget level (e.g., "Cheap", "Moderate", "Luxury").
 * @param {number} hotelCount - Number of hotels to return.
 * @returns {Promise<{ chatSession: any, initialResponseText: string }>} A promise that resolves to the chat session and the first response.
 * @throws {Error} Throws an error if the API call fails.
 */
export async function startTravelPlanChat(location, totalDays, traveler, budget, hotelCount = 5) {
    console.log("Starting new travel plan chat...");

    // Start a new chat session
    const chatSession = model.startChat({
        generationConfig,
        safetySettings,
    });

    // Prepare the initial detailed prompt with hotelCount
    const values = { location, totalDays, traveler, budget, hotelCount };
    const initialPrompt = fillPromptTemplate(AI_PROMPT_TEMPLATE, values);

    console.log("Sending initial prompt to Gemini:", initialPrompt);

    try {
        // Send the initial prompt to get the plan
        const result = await chatSession.sendMessage(initialPrompt);
        const response = result.response;

        if (!response) {
            throw new Error("No initial response received from the API.");
        }

        const initialResponseText = response.text();
        console.log("Raw initial response text:", initialResponseText);

        // Return BOTH the session (for future messages) and the first response
        return { chatSession, initialResponseText };

    } catch (error) {
        console.error("Error starting chat or sending initial message:", error);
        throw new Error(`Failed to start travel plan chat: ${error.message}`);
    }
}

/**
 * Sends a follow-up message to an existing chat session.
 *
 * @param {any} chatSession - The active chat session object (obtained from startTravelPlanChat).
 * @param {string} message - The user's follow-up message.
 * @returns {Promise<string>} A promise that resolves to the text of the AI's response.
 * @throws {Error} Throws an error if the API call fails or chatSession is invalid.
 */
export async function sendChatMessage(chatSession, message) {
    if (!chatSession || typeof chatSession.sendMessage !== 'function') {
        console.error("Invalid chatSession object passed to sendChatMessage.");
        throw new Error("Invalid chat session provided.");
    }
    if (!message || typeof message !== 'string' || message.trim() === '') {
        console.warn("Attempted to send an empty message.");
        return ""; // Or throw an error if empty messages aren't allowed
    }

    console.log("Sending follow-up message:", message);

    try {
        const result = await chatSession.sendMessage(message);
        const response = result.response;

        if (!response) {
            throw new Error("No response received for follow-up message.");
        }

        const responseText = response.text();
        console.log("Raw follow-up response text:", responseText);
        return responseText;

    } catch (error) {
        console.error("Error sending follow-up message:", error);
        throw new Error(`Failed to send message: ${error.message}`);
    }
}
