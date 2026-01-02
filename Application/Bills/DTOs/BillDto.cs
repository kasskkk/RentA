using System;

namespace Application.Bills.DTOs;

public class BillDto
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }

    public string ApartmentId { get; set; }
}