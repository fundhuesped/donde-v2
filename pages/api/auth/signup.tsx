import { NextApiHandler } from 'next';

const handler: NextApiHandler = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'This endpoint only supports POST requests' });
  }

  console.log(req.body);

  return res.status(200).end();
};

export default handler;
