package hoangtugio.org.userservice.Controller;

import hoangtugio.org.userservice.Exception.CustomException;
import hoangtugio.org.userservice.Model.OTP;
import hoangtugio.org.userservice.Model.User;
import hoangtugio.org.userservice.Repository.OTPRepository;
import hoangtugio.org.userservice.Repository.UserRepository;
import hoangtugio.org.userservice.Service.OTPService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@RestController
@RequestMapping("api/otp")
@RequiredArgsConstructor

public class OTPController {

    @Autowired
    RestTemplate restTemplate;

    private final OTPService otpService;
    private final UserRepository customerRepository;
    private final OTPRepository OTPrepository;



    @Async
    @GetMapping("/sendOtp")
    @CrossOrigin(origins = "*")
    public void sendOTP(String email) {


        Optional<User> user = customerRepository.findByEmail(email);

        if (user.isEmpty())
        {
            throw new CustomException("Email deo ton tai", HttpStatus.BAD_REQUEST);
        }

        String otp = otpService.generateOTP(user.get().getEmail());


        String url = "http://NOTIFICATION-SERVICE/api/notification/otp?to=" + email + "&otp=" + otp;
         restTemplate.getForObject(url, String.class);
    }

    @GetMapping("/verify")
    public String verifyOtp(@RequestParam String email, @RequestParam String otp) {
        Optional<User> customer = customerRepository.findByEmail(email);
        if (customer.isEmpty()) {
            return "Invalid email";
        }

        boolean isValid = otpService.verifyOTP(customer.get().getEmail(), otp);
        return isValid ? "OTP verified successfully" : "Invalid or expired OTP";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String email, @RequestParam String otp, @RequestParam String newPassword) {
        Optional<User> customer = customerRepository.findByEmail(email);
        if (customer.isEmpty()) {
            return "Invalid email";
        }

        Optional<OTP> otpreal = OTPrepository.findTopByEmailOrderByExpiryDateDesc(email);
        if (!otpreal.get().getOtp().equals(otp)) {
            return "Invalid OTP";
        }
        customer.get().setPassword(newPassword);
        customerRepository.save(customer.get());
        return "Password reset successfully";
    }


    @GetMapping("testmenu")
    public String testMenu() {
        String url = "http://MENU-SERVICE/api/category";
        return restTemplate.getForObject(url, String.class);
    }


}
