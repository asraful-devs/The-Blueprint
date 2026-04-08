const welcomeTemplate = (name: string, transactionId: string) => {
    return `
		<!doctype html>
		<html>
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Welcome to The Blueprint</title>
			</head>
			<body style="margin:0;padding:0;background:#f6f9fc;font-family:Arial,sans-serif;color:#1f2937;">
				<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
					<tr>
						<td align="center">
							<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
								<tr>
									<td style="background:#0f172a;padding:20px 24px;color:#ffffff;">
										<h1 style="margin:0;font-size:22px;line-height:1.3;">Welcome to The Blueprint</h1>
									</td>
								</tr>
								<tr>
									<td style="padding:24px;">
										<p style="margin:0 0 12px 0;font-size:16px;line-height:1.6;">Hello ${name},</p>
										<p style="margin:0 0 12px 0;font-size:15px;line-height:1.7;">
											Your account has been created successfully. We are excited to have you onboard.
										</p>
										<p style="margin:0 0 12px 0;font-size:14px;line-height:1.7;color:#374151;">
											Email transaction id: <strong>${transactionId}</strong>
										</p>
										<p style="margin:16px 0 0 0;font-size:14px;line-height:1.7;color:#6b7280;">
											If you did not create this account, please contact support immediately.
										</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</body>
		</html>
	`;
};

export default welcomeTemplate;
