namespace Customers.API.DTOs
{
    public class VerifyLoginOtpRequestDto
    {
        public string ICNumber { get; set; }
        public string Otp { get; set; }
    }
}
