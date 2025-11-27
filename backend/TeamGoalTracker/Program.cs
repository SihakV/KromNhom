using TeamGoalTracker.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add custom services
builder.Services.AddSingleton<IDatabaseService, DatabaseService>();
builder.Services.AddScoped<ITeamService, TeamService>();

// Add connection string
builder.Configuration.AddInMemoryCollection(new[]
{
    new KeyValuePair<string, string?>("ConnectionStrings:DefaultConnection", 
        "Server=localhost,1433;Database=TeamGoalTracker;User Id=sa;Password=MyStrongPassword123!;TrustServerCertificate=true;")
});

var app = builder.Build();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var databaseService = scope.ServiceProvider.GetRequiredService<IDatabaseService>();
    await databaseService.InitializeDatabaseAsync();
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.MapControllers();

app.Run();
