import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  basePath: "https://api.openai.iniad.org/api/v1",
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "APIだめ",
      },
    });
    return;
  }

  const message = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: message,
      temperature: 0.9,
      max_tokens: 100,
    });
    res.status(200).json({ result: completion.data.choices[0].message });
  } catch (error: any) {

    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
