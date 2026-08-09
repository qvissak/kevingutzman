---
paths:
  - "**/*.kt"
  - "**/*.kts"
  - "**/*.gradle"
---

# Android Foundations

## Composable component standards

Use this structure by default for screen components and reusable UI components:

```kotlin
@Composable
fun FeatureComponent(
    data: String,
    modifier: Modifier = Modifier,
) {
    // implementation
}

@ThemePreviews
@Composable
private fun FeatureComponentPreview() {
    AppTheme {
        FeatureComponent(data = "data")
    }
}
```

Apply these without exception:

- Every composable that renders UI MUST accept `modifier: Modifier = Modifier`.
- `modifier` MUST be the first optional parameter.
- Composable function names MUST use PascalCase.
- Preview functions MUST be `private` and MUST live at the bottom of the file.
- Use `stringResource()` for user-facing strings that should be localized.
- Keep composables focused on rendering and simple event wiring. Business logic does not belong in the composable body or click lambda.

## Kotlin formatting standards

Keep Kotlin formatting explicit and stable so diffs stay readable and imports remain predictable.

- Never use wildcard imports such as `import com.example.*`. Import each symbol explicitly to avoid ambiguous references and import conflicts.
- When a function declaration, class declaration, function call, or class instantiation has more than one parameter, put each parameter on its own line.
- Name arguments in multi-parameter function calls and class instantiations.
- Use trailing commas for multi-line declarations, calls, collections, and constructors.

```kotlin
val items = listOf(
    thing1,
    thing2,
)

fun doStuff(
    param1: String,
    param2: Boolean,
)

val result = doStuff(
    param1 = "yup",
    param2 = true,
)

data class MyGuy(
    val field1: String,
    val field2: Boolean,
)
```

## Dependency injection

Use dependency injection to separate responsibilities and make units testable in isolation.

ViewModels MUST use Hilt constructor injection:

```kotlin
@HiltViewModel
class FeatureViewModel @Inject constructor(
    // dependencies
) : ViewModel()
```

Repositories, use cases, wrappers, managers, and similar classes MUST use constructor injection with a scope that matches their lifecycle and statefulness:

```kotlin
@Singleton
class FeatureRepository @Inject constructor(
    private val dependency: DependencyClass
) {
    private val featureCache = mutableListOf<String>()
}

@Reusable
class FeatureWrapper @Inject constructor(
    private val dependency: DependencyClass
) {
    fun doWork() { }
}
```

Use `@Singleton` for classes or provided objects that hold state, own caches, or must remain the same instance for correctness. Use `@Reusable` for stateless helpers and lightweight objects that do not require singleton behavior.

Do not create dependencies ad hoc inside ViewModels, composables, repositories, use cases, wrappers, managers, or other application classes. If an object can be injected, it MUST be injected. If an object must be constructed manually, that construction MUST live in either a dedicated wrapper or factory class, or a `@Provides` function in a Hilt module, so creation logic stays centralized and testable.

**Don't**

```kotlin
class FeatureViewModel : ViewModel() {
    private val gson = Gson()
    private val formatter = PhoneNumberUtil.createInstance(context)
}
```

**Do**

```kotlin
@HiltViewModel
class FeatureViewModel @Inject constructor(
    private val gson: Gson,
    private val formatter: PhoneNumberFormatter,
) : ViewModel()
```

Follow this module pattern for provided dependencies:

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object FeatureModule {

    @Provides
    @Singleton
    fun provideFeatureApi(retrofit: Retrofit): FeatureApi {
        return retrofit.create(FeatureApi::class.java)
    }

    @Provides
    @Reusable
    fun provideGson(): Gson {
        return Gson()
    }
}
```

Avoid logic in composables. Route user actions into the ViewModel and let injected dependencies handle branching, side effects, and analytics.

**Don't**

```kotlin
ComposeComponent(
    onClick = {
        if (uiState.flag) {
            viewModelAction1()
        } else {
            viewModelAction2()
        }
        analyticsManager?.trackClick()
    }
)
```

**Do**

```kotlin
ComposeComponent(
    onClick = viewModelAction
)

class ViewModel @Inject constructor(
    private val analyticsManager: AnalyticsManager,
) {
    fun viewModelAction() {
        if (uiState.flag) {
            action1()
        } else {
            action2()
        }
        analyticsManager.trackClick()
    }
}
```

## State management flow

Follow unidirectional data flow:

```text
UI Event (Composable)
    ↓
ViewModel Method
    ↓
transientUiState.update { }
    ↓
uiState (StateFlow)
    ↓
collectAsStateWithLifecycle()
    ↓
Recompose UI
```

Use this as the default mental model:

- Composables emit events upward.
- ViewModels receive events and decide what to do.
- ViewModels update a single observable state holder.
- The UI reads state with `collectAsStateWithLifecycle()`.
- Recomposition is the result of state change, not a place to perform work.

Do not mutate UI state directly from the composable. Do not bypass the ViewModel by putting branching, mutation, or side effects inside event lambdas when that logic can live in the ViewModel.
