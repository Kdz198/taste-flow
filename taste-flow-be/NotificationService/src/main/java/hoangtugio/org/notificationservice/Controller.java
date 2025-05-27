package hoangtugio.org.notificationservice;


import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/notification")
public class Controller {

    @Autowired
    EmailService emailService;
    @GetMapping
    public String test()
    {
        return "test";
    }

    @GetMapping("otp")
    public String otp(@RequestParam String to, @RequestParam String otp)
    {
        try {
            emailService.sendOtpEmail(to,otp);
            return "Email sent successfully to " ;
        } catch (MessagingException e) {
            return "Error sending email: " + e.getMessage();
        }
    }
}
