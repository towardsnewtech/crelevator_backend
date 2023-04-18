/**
 * @file Manager for sending emails
 * @author Vladan Kudlac <vladankudlac@gmail.com>
 */

const config = require('../config');
const log = require('./logger');
const nodemailer = require('nodemailer');
const db = require('../model/index');
const Project = db.Project;

module.exports = {
	sendProjectFinished(recipient, project, success, user) {
		Project.findOne({where: {project: project}}).then(findProject => {
			if(findProject) {
				var transport = nodemailer.createTransport({
					host: config.emailServer, // Amazon email SMTP hostname
					secureConnection: true, // use SSL
					port: 465, // port for secure SMTP
					auth: {
						user: config.emailUser, // Use from Amazon Credentials
						pass: config.emailPasswd // Use from Amazon Credentials
					}
				});
		
				const projectLink = `https://www.easyprez.fr/project/${project}`;
				const watchLink = `https://www.easyprez.fr/watch/${project}`;
				const videoLink = `https://vaultvideo.s3.eu-west-3.amazonaws.com/${project}.mp4`;
		
				const email = {
					from: config.adminEmail,
					to: recipient,
					subject: `${user}, Votre conférence "${findProject.title}" a été compilée et publiée`, // Subject line
				};
		
				if (success) {
					email.html = 
						`<p>Bonjour ${user},</p>
						<p>Votre conférence "${findProject.title}",  a été compilée et publiée.</p>
						<p>Vous pouvez la voir à l'adresse suivante: <a href="${watchLink}">${watchLink}</a></p>
						<p>Vous pouvez reprendre le travail d'édition en cliquant sur ce lien. <a href="${projectLink}">${projectLink}</a></p>
						<p>(Vous devrez vous identifier pour accéder à votre espace personnel.)</p>
						<p>L'équipe EasyPrez</p>
						<p>Votre studio en ligne</p>
						`;
				}
				else {
					email.to += `, ${config.adminEmail}`;
					email.html = `<p>Your <a href="${projectLink}">project</a> could not be processed.</p>
						<p>We apologize for the inconvenience, we will address the issue as soon as possible.</p>`;
				}
		
				transport.sendMail(email, (err) => {
					if (err) log.error(`Email to ${recipient} (project ${project}) failed!`, err);
					else {
						log.info(`Email send to: "${recipient}"`);
					}
				});
			}
		});
	}
}