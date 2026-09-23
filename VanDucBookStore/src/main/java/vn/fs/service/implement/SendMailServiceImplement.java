/*
 * (C) Copyright 2022. All Rights Reserved.
 *
 * @author DongTHD
 * @date Mar 10, 2022
*/
package vn.fs.service.implement;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import vn.fs.dto.MailInfo;
import vn.fs.service.SendMailService;

@Service
public class SendMailServiceImplement implements SendMailService {

	@Autowired
	JavaMailSender sender;

	List<MailInfo> list = new ArrayList<>();

	@Override
	public void send(MailInfo mail) throws MessagingException, IOException {
		// Da tat chuc nang gui mail
	}

	@Override
	public void queue(MailInfo mail) {
		// Da tat chuc nang gui mail
	}

	@Override
	public void queue(String to, String subject, String body) {
		// Da tat chuc nang gui mail
	}

	@Override
	public void run() {
		// Da tat background schedule gui mail
	}

}
