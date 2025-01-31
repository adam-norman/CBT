using AutoMapper;
using Customers.API.DTOs;
using Customers.API.Infrastructure.Entities;

namespace Customers.API.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CustomerDto, Customer>().ReverseMap();
        }
    }
}
