import { ask } from 'stdio';

export default async function confirmation(question: string, maxRetries = 2) {
  const noes = ['no', 'n', 'NO', 'N'];
  const yeses = ['yes', 'y', 'YES', 'Y'];

  const answer = await ask(question, {
    options: [...yeses, ...noes],
    maxRetries
  });

  return yeses.includes(answer);
}
