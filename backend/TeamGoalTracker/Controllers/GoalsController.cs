using Microsoft.AspNetCore.Mvc;
using TeamGoalTracker.Models;
using TeamGoalTracker.Services;

namespace TeamGoalTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GoalsController : ControllerBase
{
    private readonly ITeamService _teamService;

    public GoalsController(ITeamService teamService)
    {
        _teamService = teamService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<Goal>>> CreateGoal([FromBody] CreateGoalRequest request)
    {
        try
        {
            var goal = await _teamService.CreateGoalAsync(request);
            return Ok(new ApiResponse<Goal>
            {
                Success = true,
                Data = goal,
                Message = "Goal created successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<Goal>
            {
                Success = false,
                Message = $"Error creating goal: {ex.Message}"
            });
        }
    }

    [HttpPut("{id}/complete")]
    public async Task<ActionResult<ApiResponse<bool>>> CompleteGoal(int id, [FromBody] CompleteGoalRequest request)
    {
        try
        {
            var success = await _teamService.CompleteGoalAsync(id, request.IsCompleted);
            if (!success)
            {
                return NotFound(new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Goal not found"
                });
            }

            return Ok(new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "Goal completion status updated successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<bool>
            {
                Success = false,
                Message = $"Error updating goal completion: {ex.Message}"
            });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteGoal(int id)
    {
        try
        {
            var success = await _teamService.DeleteGoalAsync(id);
            if (!success)
            {
                return NotFound(new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Goal not found"
                });
            }

            return Ok(new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "Goal deleted successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<bool>
            {
                Success = false,
                Message = $"Error deleting goal: {ex.Message}"
            });
        }
    }
}

public class CompleteGoalRequest
{
    public bool IsCompleted { get; set; }
}