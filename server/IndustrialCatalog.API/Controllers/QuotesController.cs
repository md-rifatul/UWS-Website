using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IndustrialCatalog.Application.Common.Interfaces;
using IndustrialCatalog.Application.DTOs;

namespace IndustrialCatalog.API.Controllers;

/// <summary>
/// Quotation and Request for Quote (RFQ) management for corporate buyers.
/// </summary>
public class QuotesController : BaseApiController
{
    private readonly IRfqService _rfqService;

    public QuotesController(IRfqService rfqService)
    {
        _rfqService = rfqService;
    }

    /// <summary>
    /// Submits a new Request for Quote (RFQ) with multiple configured machinery units and notes.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<RFQDto>> SubmitRfq([FromBody] SubmitRFQDto dto, CancellationToken ct)
    {
        Guid? currentUserId = null;
        var subClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (Guid.TryParse(subClaim, out var parsedId))
        {
            currentUserId = parsedId;
        }

        var result = await _rfqService.SubmitRfqAsync(dto, currentUserId, ct);
        return CreatedAtAction(nameof(GetRfqByReference), new { refNumber = result.ReferenceNumber }, result);
    }

    /// <summary>
    /// Tracks RFQ status, line items, and estimated schedule by unique reference number.
    /// </summary>
    /// <param name="refNumber">RFQ Reference Number (e.g. RFQ-2026-1001)</param>
    /// <param name="ct">Cancellation token</param>
    [HttpGet("ref/{refNumber}")]
    public async Task<ActionResult<RFQDto>> GetRfqByReference(string refNumber, CancellationToken ct)
    {
        var result = await _rfqService.GetRfqByReferenceAsync(refNumber, ct);
        if (result == null) return NotFound(new { message = $"RFQ '{refNumber}' not found." });
        return Ok(result);
    }

    /// <summary>
    /// Retrieves historical quotation submissions for the authenticated corporate buyer.
    /// </summary>
    [Authorize]
    [HttpGet("user")]
    public async Task<ActionResult<List<RFQDto>>> GetUserRfqs(CancellationToken ct)
    {
        var subClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(subClaim, out var userId))
        {
            return Unauthorized();
        }

        var result = await _rfqService.GetUserRfqsAsync(userId, ct);
        return Ok(result);
    }
}
