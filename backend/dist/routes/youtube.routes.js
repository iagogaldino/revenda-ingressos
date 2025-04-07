"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtubeRoutes = void 0;
const express_1 = require("express");
const youtube_controller_1 = require("../controllers/youtube.controller");
const youtube_service_1 = require("../services/youtube.service");
const router = (0, express_1.Router)();
const youtubeService = new youtube_service_1.YoutubeService();
const youtubeController = new youtube_controller_1.YoutubeController(youtubeService);
// Adicionado NextFunction para tratamento de erros
router.get('/youtube/search', (req, res, next) => youtubeController.searchVideo(req, res, next));
router.get('/youtube/search/multiple', (req, res, next) => youtubeController.searchVideos(req, res, next));
exports.youtubeRoutes = router;
