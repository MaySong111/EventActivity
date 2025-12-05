

using System.Diagnostics;
using API.core.Dtos;
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