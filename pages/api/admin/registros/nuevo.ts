import { NextApiHandler } from 'next';
import userSignupShared from '../../../../utils/userSignupShared';

const handler: NextApiHandler = async (req, res) => userSignupShared(req, res, true);
export default handler;
