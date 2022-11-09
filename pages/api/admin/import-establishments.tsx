import { NextApiHandler, NextApiRequest } from 'next';
import formidable, { File } from 'formidable';
import mime from 'mime';
import { importDataFromCSV } from '../../../scripts/importDataFromCSV';
import * as fs from 'fs/promises'

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: process.env.IMPORT_MAX_FILE_SIZE + 'mb',
  },
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'This endpoint only supports POST requests' });
  }

  let filePath = undefined;

  try {
    const { files } = await parseForm(req); 
    if (files.file instanceof formidable.File) {
      filePath = files.file.filepath;
    } else {
      return res.status(500).json({
        error: 'La extensión del archivo no es la adecuada o el tamaño es mayor al permitido.'
      });
    }
  } catch (e) {
    return res.status(500).json({
      error: 'Hubo un fallo al recibir el archivo.'
    });
  }

  try {
    if (filePath) {
      await importDataFromCSV(filePath);
      await fs.unlink(filePath);
      return res.status(200).end();
    } else {
      return res.status(500).json({
        error: 'Hubo un fallo al recibir el archivo.'
      });
    }
  } catch (e) {
    const error = e as Error;
    await fs.unlink(filePath);
    return res.status(500).json({
      error: error.message,
    });
  }
};

const parseForm = async (req: NextApiRequest)
    : Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return await new Promise(async (resolve, reject) => {
    let maxFileSize = 10;
    if (process.env.IMPORT_MAX_FILE_SIZE) {
      maxFileSize = +process.env.IMPORT_MAX_FILE_SIZE;
    }
     
    let filename = '';
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
