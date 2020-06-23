import { Router } from 'express';
import Controller from './controller';
import validationConfig from './validations';
import { validationHandler, authorizationHandler, PermissionType } from '../../libs';

const userRoutes: Router  = Router();
const { fetchMe, login } = Controller;
const { get: getConfig, login: loginConfig } = validationConfig;
const moduleName = 'users';

/**
 *
 * @swagger
 *
 * definitions:
 *   Document:
 *     type: object
 *     properties:
 *       createdAt:
 *         type: string
 *         description: timestamp of document record creation
 *         example: 2020-02-14T11:24:34.398Z
 *       updatedAt:
 *         type: string
 *         description: timestamp of document record updation
 *         example: 2020-02-18T09:33:42.033Z
 *       originalId:
 *         type: string
 *         description: unique identification id of record
 *         example: 5e4683724afcda2b097391a9
 *       createdBy:
 *         type: string
 *         description: original id of decument who created the record
 *         example: 5e4683724afcda2b097391a9
 *       updatedBy:
 *         type: string
 *         description: original id of who updated the record
 *         example: 5e4683724afcda2b097391a9
 *       _v:
 *         type: string
 *         description: version of record
 *         example: 0
 *   User:
 *     type: object
 *     allOf:
 *       - $ref: '#/definitions/UserPost'
 *       - type: object
 *     properties:
 *       role:
 *         type: string
 *         enum:
 *           - head-trainer
 *           - trainer
 *           - trainee
 *         description: role of user
 *         example: head-trainer
 *       dob:
 *         example: 1994-12-31T18:30:00.000Z
 *
 *   UserLogin:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *         description: Email of the user
 *         example: abc@successive.tech
 *       password:
 *         type: string
 *         format: password
 *         description: Password of the user.
 *         example: Training@123
 *
 *   Response:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 *         description: Operation performed via request
 *         example: successful
 *       status:
 *         type: string
 *         description: status of request
 *         example: OK
 *       timestamp:
 *         type: string
 *         description: request's timestamp
 *         example: 2020-02-20T09:23:00.355Z
 *
 *   LoginSuccess:
 *     allOf:
 *       - $ref: '#/definitions/Response'
 *       - type: object
 *     properties:
 *       data:
 *         type: string
 *         description: user login token
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJTdWNjZXNzaXZlIFRlY2hub2xvZ2llcyIsImV4cCI6MTU4MjE5MTA3NiwiZW1haWwiOiJ2aW5heUBzdWNjZXNzaXZlLnRlY2giLCJpZCI6IjVlNDY4MzcyNGFmY2RhMmIwOTczOTFhOSIsInJvbGUiOiJoZWFkLXRyYWluZXIiLCJuYW1lIjoidmluYXkiLCJpYXQiOjE1ODIxOTA1ODB9.NUdrAlIWbR-ymS5xjjuoKeUFngJsR36zAf02TYL3NxI
 *
 *   MeSuccess:
 *     allOf:
 *       - $ref: '#/definitions/Response'
 *       - type: object
 *     properties:
 *       data:
 *         allOf:
 *           - $ref: '#/definitions/User'
 *           - type: object
 *           - $ref: '#/definitions/Document'
 *           - type: object
 *         description: current login user data
 *
 *   Error:
 *     allOf:
 *       - $ref: '#/definitions/Response'
 *       - type: object
 *     properties:
 *       message:
 *         example: Incorrect username/password
 *       status:
 *         example: Error
 *       error:
 *         type: string
 *         description: user login token
 *         example: 401 - Incorrect username/password
 */

/**
 * @swagger
 *
 * /user/me:
 *   get:
 *     tags:
 *       - User
 *     description: Details of the logged-in user
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: current user
 *         schema:
 *           $ref: '#/definitions/MeSuccess'
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
userRoutes.get('/me', authorizationHandler(moduleName, PermissionType.read), validationHandler(getConfig), fetchMe);

/**
 * @swagger
 *
 * /user/login:
 *   post:
 *     tags:
 *       - User
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: Login Ceredentials
 *         description: Login Ceredentials of the user
 *         in: body
 *         required: true
 *         type: object
 *         schema:
 *           $ref: '#/definitions/UserLogin'
 *
 *     responses:
 *       200:
 *         description: login success
 *         schema:
 *           $ref: '#/definitions/LoginSuccess'
 *       400:
 *         description: server unable to understand the request
 *         schema:
 *           $ref: '#/definitions/Error'
 *       401:
 *         description: login failed due to incorrect username and password
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: server having internal error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
userRoutes.post('/login', validationHandler(loginConfig), login);

export default userRoutes;
