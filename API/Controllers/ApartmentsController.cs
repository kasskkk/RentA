using System;
using Application.Apartments.Commands;
using Application.Apartments.DTOs;
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
        return HandleResult(await Mediator.Send(new GetApartmentDetails.Query { Id = id }));
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateApartment(CreateApartmentDto apartmentDto)
    {
        return HandleResult(await Mediator.Send(new CreateApartment.Command { ApartmentDto = apartmentDto }));
    }

    [HttpPut]
    public async Task<ActionResult> EditApartment(Apartment apartment)
    {
        return HandleResult(await Mediator.Send(new EditApartment.Command { Apartment = apartment }));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteApartment(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteApartment.Command { Id = id }));
    }
}
