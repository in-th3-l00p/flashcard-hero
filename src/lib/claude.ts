import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateFlashcards = async (topic: string, count: number = 5): Promise<Array<{ front: string, back: string }>> => {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Generate ${count} flashcards about ${topic}. Return them in this exact JSON format without any additional text:
        {
          "flashcards": [
            {
              "front": "question or concept",
              "back": "answer or explanation"
            }
          ]
        }`
      }]
    });

    const content = message.content[0].text;
    const data = JSON.parse(content);
    return data.flashcards;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards. Please try again.');
  }
};

export const improveFlashcard = async (flashcard: { front: string, back: string }): Promise<{ front: string, back: string }> => {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Improve this flashcard by making it more clear, concise, and educational. Return in this exact JSON format without any additional text:
        {
          "flashcard": {
            "front": "${flashcard.front}",
            "back": "${flashcard.back}"
          }
        }`
      }]
    });

    const content = message.content[0].text;
    const data = JSON.parse(content);
    return data.flashcard;
  } catch (error) {
    console.error('Error improving flashcard:', error);
    throw new Error('Failed to improve flashcard. Please try again.');
  }
};
