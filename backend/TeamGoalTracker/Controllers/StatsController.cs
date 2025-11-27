using Microsoft.AspNetCore.Mvc;
using TeamGoalTracker.Models;
using TeamGoalTracker.Services;

namespace TeamGoalTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly ITeamService _teamService;

    public StatsController(ITeamService teamService)
    {
        _teamService = teamService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<TeamStatistics>>> GetStatistics()
    {
        try
        {
            var stats = await _teamService.GetTeamStatisticsAsync();
            return Ok(new ApiResponse<TeamStatistics>
            {
                Success = true,
                Data = stats,
                Message = "Statistics retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<TeamStatistics>
            {
                Success = false,
                Message = $"Error retrieving statistics: {ex.Message}"
            });
        }
    }
}