using System;
using Application.Apartments.DTOs;
using Application.Profiles.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Apartment, Apartment>();
        CreateMap<CreateApartmentDto, Apartment>();
        CreateMap<EditApartmentDto, Apartment>();
        CreateMap<User, UserProfile>();
        CreateMap<ApartmentMember, ApartmentMemberDto>();
        CreateMap<Apartment, ApartmentDto>();
        CreateMap<User, UserProfile>();
    }
}
