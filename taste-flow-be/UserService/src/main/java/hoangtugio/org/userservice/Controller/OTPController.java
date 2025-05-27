package hoangtugio.org.userservice.Controller;

import hoangtugio.org.userservice.Exception.CustomException;
import hoangtugio.org.userservice.Model.User;
import hoangtugio.org.userservice.Repository.OTPRepository;
import hoangtugio.org.userservice.Repository.UserRepository;
import hoangtugio.org.userservice.Service.OTPService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    @GetMapping("/sendOtp")
    public String sendOTP(String email) {


        Optional<User> user = customerRepository.findByEmail(email);

        if (user.isEmpty())
        {
            throw new CustomException("Email deo ton tai", HttpStatus.BAD_REQUEST);
        }

        String otp = otpService.generateOTP(user.get().getEmail());


        String url = "http://NOTIFICATION-SERVICE/api/notification/otp?to=" + email + "&otp=" + otp;
        return restTemplate.getForObject(url, String.class);
    }
}
