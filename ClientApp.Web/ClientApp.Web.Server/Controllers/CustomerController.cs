using Customers.API.Infrastructure.Entities;
using Customers.API.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Customers.API.DTOs;

namespace Customers.API.Controllers
{
    [ApiController]
    [Route("api/customers")]
    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private const int OTP_EXPIRY= 120;// seconds
        public CustomerController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CustomerDto customerDto)
        {
            if (_context.Customers.Any(c => c.ICNumber == customerDto.ICNumber))
                return BadRequest("IC Number already exists.");

            var customer = _mapper.Map<Customer>(customerDto);
            customer.OTP =   GenerateOtp();
            customer.OtpGeneratedAt = DateTime.UtcNow;

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Customer registered. OTP sent." });
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
                return NotFound("Customer not found.");

            if (DateTime.UtcNow.Subtract(customer.OtpGeneratedAt).TotalSeconds > OTP_EXPIRY)
            {
                customer.OTP = GenerateOtp();
                customer.OtpGeneratedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return BadRequest("OTP expired. New OTP sent to email.");
            }

            if (customer.OTP != otpDto.OTP)
            {
                customer.OTP = GenerateOtp();
                customer.OtpGeneratedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return BadRequest("Incorrect OTP. New OTP sent to email.");
            }

            return Ok("OTP verified.");
        }

        [HttpPost("set-pin-biometrics")]
        public async Task<IActionResult> SetPinBiometrics([FromBody] PinBiometricsDto pinDto)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.ICNumber == pinDto.ICNumber);
            if (customer == null)
                return NotFound("Customer not found.");

            customer.PIN = pinDto.PIN;
            customer.BiometricsEnabled = pinDto.EnableBiometrics;
            await _context.SaveChangesAsync();
            return Ok("PIN and Biometrics set successfully.");
        }

        private string GenerateOtp()
        {
            return "1234";// new Random().Next(1000, 9999).ToString();
        }
    }
}
