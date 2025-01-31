namespace Customers.API.DTOs
{
    public class VerifyOtpResponseDto
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public CustomerDto  Customer { get; set; }
    }
}
