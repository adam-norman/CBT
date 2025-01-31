using Customers.API.Infrastructure.Entities;
using Customers.API.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Customers.API.DTOs;
using Customers.API.Services;
using BCrypt.Net;

namespace Customers.API.Controllers
{
    [ApiController]
    [Route("api/customers")]
    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly OtpService _otpService;
        private const int OTP_EXPIRY = 120;// seconds
        public CustomerController(AppDbContext context, IMapper mapper, OtpService otpService)
        {
            _context = context;
            _mapper = mapper;
            _otpService = otpService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CustomerDto customerDto)
        {
            if (_context.Customers.Any(c => c.ICNumber == customerDto.ICNumber))
                return StatusCode(StatusCodes.Status409Conflict, "IC Number already exists.");

            var customer = _mapper.Map<Customer>(customerDto);
            customer.OTP = GenerateOtp();
            customer.OtpGeneratedAt = DateTime.UtcNow;

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            //send otp
            OtpResult otpResult = await _otpService.SendOtpAsync(customer.MobileNumber, customer.Email, customer.OTP);
            if (otpResult != null && otpResult.IsSuccess)
            {
                return Ok(otpResult);
            }
            //failed to send the otp 
            return BadRequest(otpResult);
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAllCustomers()
        {
            var customers = await _context.Customers.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<CustomerDto>>(customers));
        }
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpVerificationDto otpDto)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.ICNumber == otpDto.ICNumber);
            if (customer == null)
            {
                return BadRequest(new VerifyOtpResponseDto { Message = "Invalid or Expired Otp", IsSuccess = false });
            }
           
            if (DateTime.UtcNow.Subtract(customer.OtpGeneratedAt).TotalSeconds > OTP_EXPIRY)
            {
                customer.OTP = GenerateOtp();
                customer.OtpGeneratedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return BadRequest("OTP expired. New OTP sent to email.");
            }

            if (customer.OTP != otpDto.Otp)
            {
                customer.OTP = GenerateOtp();
                customer.OtpGeneratedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return BadRequest(new VerifyOtpResponseDto { Message = "Incorrect OTP. New OTP sent to email.", IsSuccess = false });
            }
            return Ok(new VerifyOtpResponseDto { Message = "OTP verified successfully.", IsSuccess = true , Customer=_mapper.Map<CustomerDto>(customer) });
        }

        [HttpPost("set-pin-biometrics")]
        public async Task<IActionResult> SetPinBiometrics([FromBody] PinBiometricsDto pinDto)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.ICNumber == pinDto.ICNumber);
            if (customer == null)
                return BadRequest(new VerifyOtpResponseDto { Message = "Inavlid data", IsSuccess = false });

            // Hash the PIN before saving
            customer.PIN = BCrypt.Net.BCrypt.HashPassword(pinDto.PIN);
            customer.BiometricsEnabled = pinDto.EnableBiometrics;

            await _context.SaveChangesAsync();
            return Ok(new VerifyOtpResponseDto { Message = "PIN and Biometrics set successfully.", IsSuccess = true });
        }

        private string GenerateOtp()
        {
            return "1234";// new Random().Next(1000, 9999).ToString();
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            // Find user by IC Number
            var customer = await _context.Customers.FindAsync(request.ICNumber);
            if (customer == null)
            {
                return BadRequest("customer not found.");
            }
            // Generate and send OTP to the user's mobile number
            var otpCode = _otpService.Generate();
            // save otp in the customer table
            customer.OTP = otpCode;
            customer.OtpGeneratedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            //send otp
            OtpResult otpResult = await _otpService.SendOtpAsync(customer.MobileNumber, customer.Email, otpCode);
            if (otpResult != null && otpResult.IsSuccess)
            {
                return Ok(otpResult);
            }
            //failed to send the otp 
            return BadRequest(otpResult);
        }
        [HttpGet("profile")]
        public async Task<IActionResult> Login([FromQuery] string ICNumber  )
        {
            // Find user by IC Number
            var customer = await _context.Customers.FindAsync(ICNumber);
            if (customer == null)
            {
                return BadRequest("customer not found.");
            }
             var customerDto=_mapper.Map<CustomerDto>(customer);
            return Ok(customerDto);
        }


        [HttpGet("contacts")]
        public async Task<ActionResult<UserDetailsResponseDto>> GetUserContacts([FromQuery] string icNumber)
        {
            var user = await _context.Customers.FindAsync(icNumber);

            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(new UserDetailsResponseDto
            {
                PhoneNumber = user.MobileNumber,
                EmailAddress = user.Email
            });
        }
    }
}
