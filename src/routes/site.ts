import { Router } from "express";
import * as events from '../controllers/events.js'
import * as people from '../controllers/people.js'

const router = Router();
router.get('/ping', (req, res) => res.json({pong: true}));
router.get('/events/:id', events.getAll);
router.get('/events/:id_event/people', people.getPublicPeople);
router.get('/events/:id_event/search', people.searchPerson);

export default router;