const router = require('express').Router();
const ideaMiddleware = require('./idea-controller');

router.get('/list', ideaMiddleware.listGetMid);
router.get('/view/:id', ideaMiddleware.viewIndexGetMid);
router.post('/write', ideaMiddleware.writePostMid);
router.patch('/update/:id', ideaMiddleware.updateIndexPatchMid);

module.exports = router;