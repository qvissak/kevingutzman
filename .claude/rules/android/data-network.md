---
paths:
  - "**/*.kt"
  - "**/*.kts"
  - "**/*.gradle"
---

# Android Data And Network Standards

## Purpose

Define how the existing Android project should call backend services, transform data, handle errors, and expose results to the rest of the app.

## Current Project Pattern

- Retrofit service definitions live under `components/api/*`.
- Domain models and repositories live under `app/data/...`.
- Repositories return `Result` and map DTO responses before exposing data to ViewModels.
- UI loading/error/success state is commonly bridged with `Result.toLoadableUiState()`.
- Network configuration and environment selection are injected; do not hardcode endpoints in feature code.

```text
app/src/main/java/com/dailywire/thedailywire/
├── components/
│   └── api/
│       └── <area>/
│           ├── <Area>Service.kt
│           ├── dtos/
│           └── responses/
└── app/
    └── data/
        └── <area>/
            ├── models/
            └── <Area>Repository.kt
```

## Required Standards

- Retrofit service interfaces describe HTTP endpoints only.
- Repositories wrap service calls with an injected `ApiRequestWrapper`.
- Repositories convert DTOs to domain models to expose app-level behavior as `Result`.
- Repositories handle endpoint-specific request options, cache headers, force-refresh flags.
- Repositories should be tagged `@Reusable` except when the repository contains an in-memory cache, then it should be tagged `@Singleton`.
- DTOs represent wire format and must not leak into UI.
- Domain models represent app behavior and should be safe for ViewModels and UI to consume.
- Avoid duplicate names
    - `DailyWireService` returns `FeatureObjectDto`
    - `FeatureRepository` maps to `FeatureObject`
- Network errors, parsing errors, HTTP errors, authentication errors, and connectivity errors must be represented explicitly.
- Avoid hardcoded endpoint values, environment selectors, API keys, or secrets in standards docs and examples.
- Do not add new networking libraries unless the existing stack cannot safely support the requirement.
- **Optional** `UseCases` are used to handle and transform data from multiple repositories
    - Usually unnecessary in this project

## Preferred Flow

Request path:

```text
ViewModel -> Repository -> Retrofit service -> backend
```

Response path:

```text
DTO -> Result<domain model> -> UiState
```

## Example

```kotlin
@Reusable//if repo doesn't cache data in memory
@Singleton//if repo does cache data in memory
class FeatureRepository @Inject constructor(
    private val apiRequestWrapper: ApiRequestWrapper,
    private val dailyWireService: DailyWireService,
) {
    //example of in memory cache requiring a Singleton annotation
    private val featureCache: Map<String, FeatureModel>

    suspend fun getData(
      params: DataFetchParams,
    ): Result<FeatureModel> {
        return apiRequestWrapper(checkCredentials = true) {
            dailyWireService.getFeatureData()
        }.map { it.toFeatureModel() }
    }

    private FeatureDto.toFeatureModel(): FeatureModel = FeatureModel(
        field1 = field1,
        field2 = field2.toField2Model(),//usually a companion fun on the model object
    )
}
```

## Do / Don't

Do:

```kotlin
suspend operator fun invoke(id: String): Result<Feature> {
    return apiRequest {
        api.getFeature(id, forceRefresh = false).toDomain()
    }
}
```

Don't:

```kotlin
suspend operator fun invoke(id: String): FeatureDto {
    return api.getFeature(id, forceRefresh = false)
}
```

Reason: callers need domain data and explicit failure information.

Do:

```kotlin
fun FeatureDto.toDomain(): Feature {
    return Feature(
        id = id,
        title = title.orEmpty(),
    )
}
```

Don't:

```kotlin
@Composable
fun FeatureTitle(dto: FeatureDto) {
    Text(dto.title ?: "")
}
```

Reason: DTO nullability and wire quirks should be normalized before UI.

## Caching And Refresh

- Treat force-refresh behavior as an explicit input.
- Centralize cache header decisions in API wrappers or network helpers.
- Do not let UI components know HTTP cache header names or values.
- Preserve offline behavior when changing caching, persistence, or refresh logic.

## Exceptions

- A very small API wrapper can return DTOs internally if the use case immediately maps them before exposing the result.
- Existing code may mix service and API wrapper responsibilities. New code should keep the layers separate.
- Real-backend integration tests are allowed when contract confidence is the purpose, but automated feature tests should prefer deterministic mocked responses.

## Validation Expectations

- For new endpoints, test success and representative failure cases.
- For mappers, test null, missing, or variant fields when the backend contract permits them.
- For caching or force-refresh changes, test both cached and refresh paths.
- For authentication-sensitive requests, verify headers/session behavior without logging secrets or user identifiers.
