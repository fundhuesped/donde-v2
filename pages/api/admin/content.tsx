import {NextApiHandler} from "next";
import {z} from "zod";
import {prismaClient} from "../../../server/prisma/client";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'This endpoint only supports POST, PUT and DELETE requests' });
  }

  if (req.method === 'POST') {
    const schema = z.object({
      id: z.string(),
      text: z.string(),
    });
    const queryParse = schema.safeParse(req.body);
    if (!queryParse.success) {
      return res.status(400).send(queryParse.error.message);
    }

    const {id, text} = queryParse.data;

    try {
      await prismaClient.content.create({
        data: {
          id,
          text,
        }
      });
    } catch (e) {
      return res.status(400).json({message: 'Duplicated ID'});
    }

    return res.status(200).end();
  }

  if (req.method === 'DELETE') {
    const schema = z.object({
      id: z.string(),
    });
    const queryParse = schema.safeParse(req.body);
    if (!queryParse.success) {
      return res.status(400).send(queryParse.error.message);
    }
    const queryData = queryParse.data;

    try {
      await prismaClient.content.delete({where: {id: queryData.id}});
    } catch (e) {
      return res.status(404).end();
    }
    return res.status(200).end();
  }

  const schema = z.object({
    id: z.string(),
    text: z.string().max(1024),
  });
  const queryParse = schema.safeParse(req.body);
  if (!queryParse.success) {
    const errorMessage = queryParse.error.issues[0].message;
    return res.status(400).send(errorMessage);
  }
  const {text, id} = queryParse.data;

  try {
    await prismaClient.content.update({
      where: {id},
      data: {
        text,
      }
    });
  } catch (e) {
    console.log(e);
    
    await prismaClient.content.create({
      data: {
        id,
        text,
      }
    });
  }

  return res.status(200).end();
};

export default handler;
