import { NextApiHandler } from 'next';
import userSignupShared from "../../../utils/userSignupShared";

const handler: NextApiHandler = async (req, res) => userSignupShared(req, res, false);
export default handler;
