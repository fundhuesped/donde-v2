import { NextApiHandler } from 'next';
import { prismaClient } from '../../../../server/prisma/client';
import { z } from 'zod';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'This endpoint only supports GET, PUT and DELETE requests' });
  }

  if (req.method === 'POST') {
    const schema = z.object({
      question: z.string().max(254),
      answer: z.string().max(5120),
    });
    const queryParse = schema.safeParse(req.body);
    if (!queryParse.success) {
      const errorMessage = queryParse.error.issues[0].message;
      return res.status(400).send(errorMessage);
    }
    const { question, answer } = queryParse.data;

    await prismaClient.fAQ.create({
      data: {
        question,
        answer,
      },
    });
    return res.status(200).end();
  }

  if (req.method === 'DELETE') {
    const schema = z.object({
      id: z.string().uuid(),
    });
    const queryParse = schema.safeParse(req.body);
    if (!queryParse.success) {
      return res.status(400).send(queryParse.error.message);
    }
    const queryData = queryParse.data;

    try {
      await prismaClient.fAQ.delete({ where: { id: queryData.id } });
    } catch (e) {
      return res.status(404).end();
    }
    return res.status(200).end();
  }

  const schema = z.object({
    id: z.string().uuid(),
    question: z.string().max(254),
    answer: z.string().max(5120),
  });
  const queryParse = schema.safeParse(req.body);
  if (!queryParse.success) {
    const errorMessage = queryParse.error.issues[0].message;
    return res.status(400).send(errorMessage);
  }

  const { question, answer, id } = queryParse.data;

  let faq = null;
  try {
    faq = await prismaClient.fAQ.update({
      where: { id },
      data: {
        question,
        answer,
      },
    });
  } catch (e) {
    return res.status(404).end();
  }

  return res.status(200).json(faq);
};

export default handler;
