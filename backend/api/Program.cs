using infrastructure;
using infrastructure.BoxRepository;
using service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddNpgsqlDataSource(Utilities.ProperlyFormattedConnectionString,
        dataSourceBuilder => dataSourceBuilder.EnableParameterLogging());
}

if (builder.Environment.IsProduction())
{
    builder.Services.AddNpgsqlDataSource(Utilities.ProperlyFormattedConnectionString);
}


// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSingleton<BoxRepository>();
builder.Services.AddSingleton<BoxService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
var frontEndRelativePath = "./Frontend/www/";
builder.Services.AddSpaStaticFiles(conf => conf.RootPath = frontEndRelativePath);




var app = builder.Build();

app.UseCors(options =>

{

    options.SetIsOriginAllowed(origin => true)

        .AllowAnyMethod()

        .AllowAnyHeader()

        .AllowCredentials();

});
app.UseSpaStaticFiles();
app.UseSpa(conf =>
{
    conf.Options.SourcePath = frontEndRelativePath;
});

app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();
app.Run();
