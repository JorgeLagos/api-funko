/**
 * Rutas del módulo Config.
 * Solo declara las rutas y las conecta al controlador.
 */

import { Router } from 'express';
import { configController } from './config.controller';

const router = Router();

router.get('/', (req, res) => configController.getConfig(req, res));

export const configRoutes = router;
