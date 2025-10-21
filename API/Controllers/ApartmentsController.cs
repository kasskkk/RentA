using System;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

public class ApartmentsController(AppDbContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Apartment>>> GetApartments()
    {
        return await context.Apartments.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Apartment>> GetApartmentDetail(string id)
    {
        var apartment = await context.Apartments.FindAsync(id);

        if (apartment == null)
        {
            return NotFound();
        }

        return apartment;
    }
}
