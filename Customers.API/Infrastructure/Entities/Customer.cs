using System.ComponentModel.DataAnnotations;

namespace Customers.API.Infrastructure.Entities
{
    public class Customer
    {
        [Key]
        [MaxLength(12)]
        [Required]
        public string ICNumber { get; set; }
        [MaxLength(30)]
        [Required]
        public string Email { get; set; }
        [MaxLength(100)]
        [Required]
        public string Name { get; set; }
        [MaxLength(20)]
        [Required]
        public string MobileNumber { get; set; }
        [MaxLength(4)]
        public string? OTP { get; set; }
        public DateTime OtpGeneratedAt { get; set; }

        [MaxLength(6)]
        public string? PIN { get; set; }
        public bool BiometricsEnabled { get; set; }
    }
}
