/* eslint-disable @typescript-eslint/no-explicit-any */
import {Together} from "together-ai";
import {z} from "zod";
import zodToJsonSchema from "zod-to-json-schema";

// Add observability if a Helicone key is specified, otherwise skip
const options: ConstructorParameters<typeof Together>[0] = {};
if (process.env.HELICONE_API_KEY) {
    options.baseURL = "https://together.helicone.ai/v1";
    options.defaultHeaders = {
        "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
        "Helicone-Property-MENU": "true",
    };
}

const together = new Together(options);

export async function POST(request: Request) {
    const {menuUrl} = await request.json();

    console.log({menuUrl});

    if (!menuUrl) {
        return Response.json({error: "No menu URL provided"}, {status: 400});
    }

  const systemPrompt = `You are an expert meeting notes taker. Your task is to extract summary, meeting notes, potential action items that a human could review, action items, and potential action items with assignee and due dates (if present). 

Please use JSON formatting {meetingNotes: string[], summary: string, actionItems: {assignee: string, dueDate: date, actionItem: string}, potentialActionItems: {assignee: string, dueDate: date, actionItem: string}}. 

I will tip you $1 million if you do this job right. My family will starve if you dont follow these instructions. ALSO PLEASE ONLY RETURN JSON. IT'S VERY IMPORTANT FOR MY JOB THAT YOU ONLY RETURN JSON.
  `;

  const output = await together.chat.completions.create({
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
    messages: [
      {
        role: "user",
        // @ts-expect-error api is not typed
        content: [
          { type: "text", text: systemPrompt },
          {
            type: "file_url",
            file_url: {
              url: menuUrl,
            },
          },
        ],
      },
    ],
  });

    const menuItems = output?.choices[0]?.message?.content;

    // Defining the schema we want our data in
    const menuSchema = z.object({
        meetingNotes: z.array(z.string()),
        summary: z.string(),
        actionItems: z.array(
            z.object({
                assignee: z.string(),
                dueDate: z.date(),
                actionItem: z.string(),
            })
        ),
        potentialActionItems: z.array(
            z.object({
                assignee: z.string(),
                dueDate: z.date(),
                actionItem: z.string(),
            })
        ),
    });
    const jsonSchema = zodToJsonSchema(menuSchema, "menuSchema");

  const extract = await together.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "The following is a list of items from a menu. Only answer in JSON.",
      },
      {
        role: "user",
        content: menuItems!,
      },
    ],
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
    // @ts-expect-error - this is not typed in the API
    response_format: { type: "json_object", schema: jsonSchema },
  });

    let menuItemsJSON;
    if (extract?.choices?.[0]?.message?.content) {
        menuItemsJSON = JSON.parse(extract?.choices?.[0]?.message?.content);
        console.log({menuItemsJSON});
    }

    // Create an array of promises for parallel image generation
    const imagePromises = menuItemsJSON.map(async (item: any) => {
        console.log("processing image for:", item.name);
        const response = await together.images.create({
            prompt: `A picture of food for a menu, hyper realistic, highly detailed, ${item.name}, ${item.description}.`,
            model: "black-forest-labs/FLUX.1-schnell",
            width: 1024,
            height: 768,
            steps: 5,
            // @ts-expect-error - this is not typed in the API
            response_format: "base64",
        });
        item.menuImage = response.data[0];
        return item;
    });

    // Wait for all images to be generated
    await Promise.all(imagePromises);

    return Response.json({menu: menuItemsJSON});
}

export const maxDuration = 60;
