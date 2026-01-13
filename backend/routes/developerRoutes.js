import express from 'express';
import { getAllDevelopers, getDeveloperProfile } from '../controllers/developerController.js';


 const router = express.Router();

 router.get("/all",getAllDevelopers);
 router.get("/profile/:id", getDeveloperProfile);

 export default router;