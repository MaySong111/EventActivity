
using API.core.Dtos;
using API.core.Entities;
using AutoMapper;

namespace API.core.AutomapperConfig
{
    public class AutomapperConfig : Profile
    {
        public AutomapperConfig()
        {
            CreateMap<CreateActivityDto, Activity>();
        }
    }
}