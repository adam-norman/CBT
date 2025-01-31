using static Customers.API.Constants.Enums;

namespace Customers.API.DTOs
{
    public class OtpResult
    {
        public bool IsSuccess { get; set; }
        public string  Message { get; set; }
        public int OtpMedia { get; set; }
    }
}
