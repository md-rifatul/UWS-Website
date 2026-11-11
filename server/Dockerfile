# Multi-stage Docker build for ASP.NET Core 8 Web API
# Suitable for Render, Azure App Service, AWS ECS, or DigitalOcean

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files first for efficient Docker layer caching
COPY ["Directory.Build.props", "./"]
COPY ["IndustrialCatalog.Domain/IndustrialCatalog.Domain.csproj", "IndustrialCatalog.Domain/"]
COPY ["IndustrialCatalog.Application/IndustrialCatalog.Application.csproj", "IndustrialCatalog.Application/"]
COPY ["IndustrialCatalog.Infrastructure/IndustrialCatalog.Infrastructure.csproj", "IndustrialCatalog.Infrastructure/"]
COPY ["IndustrialCatalog.API/IndustrialCatalog.API.csproj", "IndustrialCatalog.API/"]

RUN dotnet restore "IndustrialCatalog.API/IndustrialCatalog.API.csproj"

# Copy remaining source code and publish
COPY . .
WORKDIR "/src/IndustrialCatalog.API"
RUN dotnet publish "IndustrialCatalog.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "IndustrialCatalog.API.dll"]

