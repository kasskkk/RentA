using System;
using Application.Apartments.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Apartment, Apartment>();
        CreateMap<CreateApartmentDto, Apartment>();

    }
}
