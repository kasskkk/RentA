using System;
using Application.Apartments.DTOs;
using Application.Bills.DTOs;
using Application.Faults.Dtos;
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
        CreateMap<EditApartmentDto, Apartment>()
            .ForMember(d => d.Devices, o => o.Ignore());
        CreateMap<User, UserProfile>();
        CreateMap<ApartmentMember, ApartmentMemberDto>();
        CreateMap<Apartment, ApartmentDto>();
        CreateMap<User, UserProfile>();
        CreateMap<Device, DeviceDto>();
        CreateMap<DeviceDto, Device>()
    .ForMember(d => d.Id, o => o.Ignore())
    .ForMember(d => d.Faults, o => o.Ignore());
        CreateMap<Fault, FaultDto>()
            .ForMember(d => d.DeviceName, o => o.MapFrom(s => s.Device.Name));
        CreateMap<CreateFaultDto, Fault>();
        CreateMap<CreateBillDto, Bill>();
        CreateMap<Bill, BillDto>();
    }
}
