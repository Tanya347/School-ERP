import nodemailer from 'nodemailer';

export const sendEmail = async options => {
	// create a transporter
	
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		secure: false,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD
		}
	})
	
	// define the email options
	const mailOptions = {
		from: 'Aurora Projects <auroracodes.studio@gmail.com>',
		to: options.email,
		subject: options.subject,
		text: options.message
	};
	
	await transporter.sendMail(mailOptions);
}

// Send registration email to student or faculty with credentials
export const sendRegistrationEmail = async (email, username, password, userType = 'User') => {
	const message = `
Hello,

Welcome to School ERP Portal!

Your account has been successfully created. Here are your login credentials:

Username: ${username}
Password: ${password}
User Type: ${userType}

Please log in to the portal and change your password immediately for security purposes.

Login URL: https://school-erp-portal.netlify.app/

If you did not create this account or have any questions, please contact the school administration.

Best regards,
School ERP Administration
	`.trim();

	await sendEmail({
		email,
		subject: 'School ERP Account Created - Login Credentials',
		message
	});
}
