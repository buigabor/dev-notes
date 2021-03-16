import express from 'express';
import { saveCellData } from '../db';
import { verify } from './verifyToken';

const router = express.Router();

router.post('/save', verify, async (req, res) => {
  try {
    const { projectId, data, order } = req.body;
    const dataString = JSON.stringify(data);
    const orderString = JSON.stringify(order);

    const cellData = await saveCellData(projectId, dataString, orderString);

    res.status(200).json({ success: true, data: cellData });
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
