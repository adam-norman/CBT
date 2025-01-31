namespace Customers.API.DTOs
{
    public class PinBiometricsDto
    {
        public string ICNumber { get; set; }
        public string PIN { get; set; }
        public bool EnableBiometrics { get; set; }
    }
}
