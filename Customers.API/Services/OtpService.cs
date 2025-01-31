using Customers.API.DTOs;
using static Customers.API.Constants.Enums;

namespace Customers.API.Services
{
    public class OtpService
    {
        private readonly ILogger<OtpService> _logger;

        public OtpService(ILogger<OtpService> logger)
        {
            _logger = logger;
        }
        public string Generate()
        {
            return "1234";
        }
        public async Task<OtpResult> SendOtpAsync(string phone,string email, string otpCode)
        {
           if(await SendSMSOtpAsync(phone, otpCode))
            {
                return new OtpResult() {  IsSuccess = true  ,  Message= $"Otp has been sent successfully", OtpMedia= (int)OtpMedia.SMS };
            }
            if (await SendEmailOtpAsync(email, otpCode))
            {
                return new OtpResult() { IsSuccess = true, Message = $"Otp has been sent successfully", OtpMedia = (int)OtpMedia.EMAIL };
            }
            return new OtpResult() { IsSuccess = false, Message = $"failed to send the otp please try again later" };
        }
        public async Task<bool> SendSMSOtpAsync(string phoneNumber, string otpCode)
        {
            _logger.LogInformation($"Otp code: {otpCode} has been sent to phone number {phoneNumber}");

            await Task.Delay(100); // Simulate async operation (remove this if unnecessary)

            return true;
        }
        public async Task<bool> SendEmailOtpAsync(string email, string otpCode)
        {
            _logger.LogInformation($"Otp code: {otpCode} has been sent to email address {email}");
            await Task.Delay(100); // Simulate async operation (remove this if unnecessary)
            return true;
        }
    }
}
