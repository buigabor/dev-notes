import express from 'express';
import { getCellDataByProjectId, insertCellData, saveCellData } from '../db';
import { verify } from './verifyToken';

const router = express.Router();

// Get cells data by project id
router.get('/:id', verify, async (req, res) => {
  try {
    const id = req.params.id;

    const cellsData = await getCellDataByProjectId(Number(id));
    const { data, orderOfCells } = cellsData;
    const dataParsed = JSON.parse(data);
    const orderParsed = JSON.parse(orderOfCells);
    res.status(200).json({
      success: true,
      data: { cellsData: dataParsed, order: orderParsed },
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

// Save cells data by project id

router.post('/save', verify, async (req, res) => {
  try {
    const { projectId, data, order } = req.body;
    const dataString = JSON.stringify(data);
    const orderString = JSON.stringify(order);

    const cellData = await saveCellData(projectId, dataString, orderString);

    res.status(200).json({ success: true, data: cellData, error: null });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

// Insert cells data by project id
router.post('/create', verify, async (req, res) => {
  try {
    const { projectId, data, order } = req.body;
    const dataString = JSON.stringify(data);
    const orderString = JSON.stringify(order);

    const cellData = await insertCellData(projectId, dataString, orderString);

    res.status(200).json({ success: true, data: cellData, error: null });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

export default router;
