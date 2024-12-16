const express = require('express');
const controllerJar = require('../controllers/controllerJar');
const router = express.Router();

router.get('/jarRecipient/:recipientID', controllerJar.getAllJarRecipient);

router.get('/jarApprover/:approverID', controllerJar.getAllJarApprover);

router.get('/jarDetails/:jarID', controllerJar.getJarDetails);

router.post('/jarApprovals', controllerJar.updateJarApprovals);

router.post('/jarStatus', controllerJar.updateJarStatus);

router.post('/createJar', controllerJar.createJar);

module.exports = router;
