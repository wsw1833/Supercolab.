const express = require('express');
const controllerMember = require('../controllers/controllerMember');
const router = express.Router();

router.post('/createMember', controllerMember.createMember);
router.post('/changeRole', controllerMember.changeRole);
router.post('/removeMember', controllerMember.removeMember);

router.get('/getMember/:creatorId', controllerMember.getAllMembers);

module.exports = router;
