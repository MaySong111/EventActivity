
using API.core.Dtos;
using API.core.Dtos.Activity;
using API.core.Dtos.Profile;
using API.core.Entities;
using AutoMapper;

namespace API.core.AutomapperConfig
{
    public class AutomapperConfig : Profile
    {
        public AutomapperConfig()
        {
            CreateMap<CreateActivityDto, Activity>();
            
            CreateMap<ActivityAttendee, UserProfileDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.User.DisplayName))
                .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.User.Bio))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.User.ImageUrl));


            CreateMap<User, UserProfileDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.DisplayName))
                .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Bio))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl));

            CreateMap<Activity, ActivityDto>()
                .ForMember(dest => dest.Attendees, opt => opt.MapFrom(src => src.Attendees.Select(aa => aa.User)))
                .ForMember(dest => dest.HostDisplayName,
                 opt => opt.MapFrom(src => src.Attendees.FirstOrDefault(aa => aa.IsHost)!.User.DisplayName))
                .ForMember(dest => dest.HostId,
                opt => opt.MapFrom(src => src.Attendees.FirstOrDefault(aa => aa.IsHost)!.User.Id));
        }
    }
}