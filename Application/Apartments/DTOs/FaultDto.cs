using System;

namespace Application.Apartments.DTOs;

public class FaultDto
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime DateReported { get; set; }
    public bool IsResolved { get; set; }
    public DateTime? DateResolved { get; set; }
}