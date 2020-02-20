import { Router } from 'express';
import Controller from './controller';
import { validationHandler, authorizationHandler, PermissionType } from '../../libs';
import validationConfig from './validations';

const traineeRoutes: Router  = Router();
const moduleName = 'trainee';
const { list, create, update, delete: deleteFunction } = Controller;
const { get: getConfig, create: createConfig, update: updateConfig, delete: deleteConfig } = validationConfig;

/**
 *
 * @swagger
 *
 * definitions:
 *   TraineListSuccess:
 *     allOf:
 *       - $ref: '#/definitions/Response'
 *       - type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           count:
 *             type: int
 *             example: 1
 *           records:
 *             type: array
 *             items:
 *               allOf:
 *                 - $ref: '#/definitions/User'
 *                 - type: object
 *                 - $ref: '#/definitions/Document'
 *                 - type: object
 *
 *   TraineSuccess:
 *     allOf:
 *       - $ref: '#/definitions/Response'
 *       - type: object
 *     properties:
 *       data:
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/User'
 *           - type: object
 *           - $ref: '#/definitions/Document'
 *           - type: object
 *
 */

traineeRoutes.route('/')

/**
 *
 * @swagger
 *
 * /trainee/:
 *   get:
 *     tags:
 *       - Trainee
 *     description: Returns the list of the trainnes.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: skip
 *         type: number
 *         description: to skip the records from starting
 *         in: query
 *         default: 0
 *       - name: limit
 *         type: number
 *         description: to limit the records to response
 *         in: query
 *         default: 10
 *       - name: search
 *         type: string
 *         description: to search from the records
 *         in: query
 *       - name: sort
 *         type: string
 *         description: to search from the records for particular column
 *         in: query
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *           $ref: '#/definitions/TraineListSuccess'
 *       401:
 *         description: user is unauthorised
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: server having internal error
 *         schema:
 *           $ref: '#/definitions/Error'
 *
 */
.get(authorizationHandler(moduleName, PermissionType.read), validationHandler(getConfig), list)

/**
 *
 * @swagger
 *
 * /trainee/:
 *   post:
 *     tags:
 *       - Trainee
 *     description: Returns the success reponse on creation.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Request Body
 *         description: Trainee details for trainee user creation
 *         in: body
 *         required: true
 *         type: object
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *           $ref: '#/definitions/TraineSuccess'
 *       400:
 *         description: server unable to understand the request
 *         schema:
 *           $ref: '#/definitions/Error'
 *       401:
 *         description: user is unauthorised
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: server having internal error
 *         schema:
 *           $ref: '#/definitions/Error'
 *
 */
.post(authorizationHandler(moduleName, PermissionType.write), validationHandler(createConfig), create)

/**
 *
 * @swagger
 *
 * /trainee/:
 *   put:
 *     tags:
 *       - Trainee
 *     description: Update the details of trainee.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Request Body
 *         description: Trainee details for trainee user updation
 *         in: body
 *         required: true
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *           dataToUpdate:
 *             type: object
 *             allOf:
 *               - $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *           $ref: '#/definitions/TraineSuccess'
 *       400:
 *         description: server unable to understand the request
 *         schema:
 *           $ref: '#/definitions/Error'
 *       401:
 *         description: user is unauthorised
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: server having internal error
 *         schema:
 *           $ref: '#/definitions/Error'
 *
 */
.put(authorizationHandler(moduleName, PermissionType.write), validationHandler(updateConfig), update);

/**
 *
 * @swagger
 *
 * /trainee/{id}:
 *   delete:
 *     tags:
 *       - Trainee
 *     description: Delete the trainee user from the records.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         type: string
 *         in: path
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *           $ref: '#/definitions/TraineSuccess'
 *       401:
 *         description: user is unauthorised
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: server having internal error
 *         schema:
 *           $ref: '#/definitions/Error'
 *
 */
traineeRoutes.delete('/:id', authorizationHandler('trainee', 'delete'), validationHandler(validationConfig.delete), deleteFunction);

export default traineeRoutes;
