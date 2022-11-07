import { NextApiHandler, NextApiRequest } from 'next';
import formidable, { File } from 'formidable';
import mime from 'mime';
import { importCSV } from '../../../scripts/importDataFromCSV';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: process.env.IMPORT_MAX_FILE_SIZE + 'mb',
  },
};

const handler: NextApiHandler = async (req, res) => {
  console.log('Start request');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'This endpoint only supports POST requests' });
  }
  
  try {
    const {fields, files} = await parseForm(req);
    console.log(fields, files)

    if (files.file instanceof formidable.File) {
      console.log('Correct file')
      await importCSV(files.file.filepath);
    } else {
      console.log('Incorrect file')
    }
    
    return res.status(200).json({
      data: {
        fields,
        files,
      },
      error: null,
    });
  } catch (e) {
    console.log(e);
    return res.status(500);
  }
};

export const parseForm = async (req: NextApiRequest)
    : Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return await new Promise(async (resolve, reject) => {
    let maxFileSize = 10;
    if (process.env.IMPORT_MAX_FILE_SIZE) {
      maxFileSize = +process.env.IMPORT_MAX_FILE_SIZE;
    }
     
    let filename = "";
    const form = formidable({
      maxFiles: 1,
      maxFileSize: maxFileSize * 1024 * 1024,
      uploadDir: process.env.IMPORT_TMP_FILES_DIR,
      filename: (_name, _ext, part) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        filename = `${part.name || 'unknown'}-${uniqueSuffix}.${
          mime.getExtension(part.mimetype || '') || 'unknown'
        }`;
        return filename;
      },
      filter: (part) => {
        return part.name === 'file' && (part.mimetype?.includes('text/csv') || false);
      },
    });

    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err);
      }
      else {
        resolve({ fields, files });
      }
    });
  });
};

export default handler;
