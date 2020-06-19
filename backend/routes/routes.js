const express = require('express');
const router = express.Router();

const { createUser, loginUser, getUser, createTeacher, getUserByEmail } = require('./../controller/user');
const { assess } = require('./../controller/grade');
const { uploadProject, getProjects, getRowsTeacher } = require('./../controller/project');

router.post('/register', createUser);
router.post('/registerteacher', createTeacher);
router.post('/login', loginUser);
router.post('/userByEmail',getUserByEmail)
router.post('/project', uploadProject);
router.get('/project/:idUser', getProjects); //get pentru ce proiecte ai de evaluat
router.get('/user/:idUser', getUser);
router.post('/grade', assess); 
router.get('/teacher', getRowsTeacher);

module.exports = router;