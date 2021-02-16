package com.stackroute.auth.controller;

import com.stackroute.auth.EmailTemplate;
import com.stackroute.auth.exception.InvalidOtpException;
import com.stackroute.auth.service.EmailService;
import com.stackroute.auth.service.OTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/v1")
public class OTPController {


    @Autowired
    public OTPService otpService;

    @Autowired
    public EmailService emailService;


    @GetMapping("/otp/{email}")
    public ResponseEntity<?> generateOTP(@PathVariable String email) throws MessagingException {

        try{
            int otp = otpService.generateOTP(email);
            //Generate The Template to send OTP
            EmailTemplate template = new EmailTemplate("SendOtp.html");
            Map<String, String> replacements = new HashMap<String, String>();
            replacements.put("user", email);
            replacements.put("otpNumber", Integer.toString(otp));
            String message = template.getTemplate(replacements);

            emailService.sendOtpMessage(email, "Quantum OTP", message);
            return new ResponseEntity<>("OTP Generated",HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>("OTP is not Generated",HttpStatus.CONFLICT);
        }

    }

    @GetMapping("/validate/{email}/{otpnum}")
    public ResponseEntity<?> OTPController(@PathVariable int otpnum,
                                           @PathVariable String email) throws InvalidOtpException {

        //Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //String username = auth.getName();
        //Validate the Otp
        if (otpnum >= 0) {

            int serverOtp = otpService.getOtp(email);
            if (serverOtp > 0) {
                if (otpnum == serverOtp) {
                    otpService.clearOTP(email);
                    return new ResponseEntity<>("Entered Otp is valid",HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Entered Otp is NOT valid. Please Retry!", HttpStatus.CONFLICT);
                }
            } else {
                return new ResponseEntity<>("Entered Otp is NOT valid. Please Retry!", HttpStatus.CONFLICT);
            }
        } else {
            return new ResponseEntity<>("Entered Otp is NOT valid. Please Retry!", HttpStatus.CONFLICT);
        }
    }
}
