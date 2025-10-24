using System;
using Application.Apartments.Commands;
using Application.Apartments.Queries;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ApartmentsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Apartment>>> GetApartments()
    {
        return await Mediator.Send(new GetApartmentList.Query());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Apartment>> GetApartmentDetail(string id)
    {
        return await Mediator.Send(new GetApartmentDetails.Query { Id = id });
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateApartment(Apartment apartment)
    {
        return await Mediator.Send(new CreateApartment.Command { Apartment = apartment });
    }

    [HttpPut]
    public async Task<ActionResult> EditApartment(Apartment apartment)
    {
        await Mediator.Send(new EditApartment.Command { Apartment = apartment });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteApartment(string id)
    {
        await Mediator.Send(new DeleteApartment.Command { Id = id });

        return NoContent();
    }
}
