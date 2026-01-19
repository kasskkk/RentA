using System;
using Domain.Enum;

namespace Domain;

public class ApartmentMember
{
    public required string UserId { get; set; }
    public User User { get; set; } = null!;
    public required string ApartmentId { get; set; }
    public Apartment Apartment { get; set; } = null!;
    public bool IsOwner { get; set; }
    public MemberStatus MemberStatus { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? AcceptedAt { get; set; }
}
