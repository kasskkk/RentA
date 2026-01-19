using System;
using Application.Profiles.DTOs;
using Domain.Enum;

namespace Application.Apartments.DTOs;

public class ApartmentMemberDto
{
    public UserProfile User { get; set; } = null!;
    public MemberStatus MemberStatus { get; set; }
    public bool IsOwner { get; set; }
}
