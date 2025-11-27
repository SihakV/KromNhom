using Microsoft.AspNetCore.Mvc;
using TeamGoalTracker.Models;
using TeamGoalTracker.Services;

namespace TeamGoalTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamMembersController : ControllerBase
{
    private readonly ITeamService _teamService;

    public TeamMembersController(ITeamService teamService)
    {
        _teamService = teamService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<TeamMemberWithGoals>>>> GetTeamMembers()
    {
        try
        {
            var teamMembers = await _teamService.GetAllTeamMembersAsync();
            return Ok(new ApiResponse<List<TeamMemberWithGoals>>
            {
                Success = true,
                Data = teamMembers,
                Message = "Team members retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<List<TeamMemberWithGoals>>
            {
                Success = false,
                Message = $"Error retrieving team members: {ex.Message}"
            });
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<TeamMember>>> CreateTeamMember([FromBody] CreateTeamMemberRequest request)
    {
        try
        {
            var newMember = await _teamService.CreateTeamMemberAsync(request);
            return CreatedAtAction(nameof(GetTeamMembers), new { id = newMember.Id }, new ApiResponse<TeamMember>
            {
                Success = true,
                Data = newMember,
                Message = "Team member created successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<TeamMember>
            {
                Success = false,
                Message = $"Error creating team member: {ex.Message}"
            });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteTeamMember(int id)
    {
        try
        {
            var success = await _teamService.DeleteTeamMemberAsync(id);
            if (!success)
            {
                return NotFound(new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Team member not found"
                });
            }

            return Ok(new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "Team member deleted successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<bool>
            {
                Success = false,
                Message = $"Error deleting team member: {ex.Message}"
            });
        }
    }

    [HttpPut("{id}/mood")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateMood(int id, [FromBody] MoodUpdateRequest request)
    {
        try
        {
            var success = await _teamService.UpdateMoodAsync(id, request.CurrentMood);
            if (!success)
            {
                return NotFound(new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Team member not found"
                });
            }

            return Ok(new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "Mood updated successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<bool>
            {
                Success = false,
                Message = $"Error updating mood: {ex.Message}"
            });
        }
    }
}