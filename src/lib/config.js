import { OPENAI_API_KEY } from '$env/static/private';

export const apiConfig = {
  openAiKey: OPENAI_API_KEY,
  apiUrl: 'https://api.openai.com/v1/completions'
};
