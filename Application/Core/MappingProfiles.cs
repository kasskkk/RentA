using System;
using Application.Apartments.DTOs;
using Application.Bills.DTOs;
using Application.Faults.DTOs;
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
        CreateMap<Device, DeviceDto>();
        CreateMap<DeviceDto, Device>();
        CreateMap<Fault, Application.Apartments.DTOs.FaultDto>();
        CreateMap<Fault, Application.Faults.DTOs.FaultDto>()
            .ForMember(d => d.DeviceName, o => o.MapFrom(s => s.Device.Name));
        CreateMap<CreateFaultDto, Fault>();
        CreateMap<CreateBillDto, Bill>();
        CreateMap<Bill, BillDto>();
    }
}
