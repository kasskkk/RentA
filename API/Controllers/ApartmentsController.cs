using System;
using Application.Apartments.Commands;
using Application.Apartments.DTOs;
using Application.Apartments.Queries;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ApartmentsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<ApartmentDto>>> GetApartments()
    {
        return await Mediator.Send(new GetApartmentList.Query());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApartmentDto>> GetApartmentDetail(string id)
    {
        return HandleResult(await Mediator.Send(new GetApartmentDetails.Query { Id = id }));
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateApartment(CreateApartmentDto apartmentDto)
    {
        return HandleResult(await Mediator.Send(new CreateApartment.Command { ApartmentDto = apartmentDto }));
    }

    [Authorize(Policy = "IsApartmentOwner")]
    [HttpPut("{id}")]
    public async Task<ActionResult> EditApartment(string id, EditApartmentDto apartmentDto)
    {
        apartmentDto.Id = id;
        return HandleResult(await Mediator.Send(new EditApartment.Command { ApartmentDto = apartmentDto }));
    }
    
    [Authorize(Policy = "IsApartmentOwner")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteApartment(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteApartment.Command { Id = id }));
    }

    [HttpPost("{id}/apply")]
    public async Task<ActionResult> ApplyToApartment(string id)
    {
        return HandleResult(await Mediator.Send(new ApplyToApartment.Command { Id = id }));
    }
}
