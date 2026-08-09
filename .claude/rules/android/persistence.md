---
paths:
  - "**/*.kt"
  - "**/*.kts"
  - "**/*.gradle"
---

# Android Persistence Standards

## Purpose

Define how the existing Android project should persist local data with Room, DataStore, and file storage while preserving migrations, user isolation, and testability.

## Current Project Pattern

- Room offline content code lives under `components/local/db`.
- Room schema history is checked in under `app/schemas`.
- DataStore-related app code lives under `app/data/datastore` and shared preferences support under `components/local/preferences`.
- Offline content is user-scoped; changes must preserve account/user boundaries.
- Tests for persistence behavior live in `app/src/test` or `app/src/androidTest` depending on whether Android runtime is required.

```text
app/
├── schemas/
└── src/
    ├── main/java/com/dailywire/thedailywire/
    │   ├── components/
    │   │   └── local/
    │   │       ├── db/
    │   │       │   ├── dao/
    │   │       │   └── data/
    │   │       │       ├── entity/
    │   │       │       └── model/
    │   │       └── preferences/
    │   └── app/
    │       └── data/
    │           └── datastore/
    ├── test/
    └── androidTest/
```

## Required Standards

- Use Room for relational or queryable structured data.
- Use DataStore for small preference-like state.
- Use file storage only for actual files or large binary content.
- Keep entities separate from domain/UI models when persistence shape differs from app behavior.
- Database schema changes must include migration handling and schema history updates when the project tracks schemas.
- User-scoped data must remain isolated by user identifier, account boundary, or explicit ownership key.
- Do not store secrets, raw auth tokens, or sensitive payloads unless the product requirement and storage mechanism are explicitly approved.
- Repository or data-source classes should hide DAO and storage implementation details from ViewModels.

## Room Standards

- Add or update entities, DAOs, migrations, and schema exports together.
- Prefer auto migrations only when the generated migration correctly represents the intended data change.
- Use manual migrations when data transformation, table splitting, backfill, or destructive changes are involved.
- Never use destructive migration in production code unless explicitly approved for that data set.

## DataStore Standards

- Keep keys centralized.
- Provide typed accessors or repository methods instead of spreading key reads across UI.
- Use Flow for observable preference changes.
- Keep default values explicit.

## Preferred Patterns

- Use repositories or data sources to hide Room, DataStore, and file details from ViewModels.
- Keep persisted models focused on storage, then map to domain models where app behavior differs.
- Treat migration code and schema files as part of the same change as entity or DAO updates.
- Keep user-scoped storage boundaries explicit in database names, ownership columns, or repository operations.

## Do / Don't

Do:

```kotlin
@Entity(tableName = "saved_items")
data class SavedItemEntity(
    @PrimaryKey val id: String,
    val title: String,
)

fun SavedItemEntity.toDomain(): SavedItem {
    return SavedItem(id = id, title = title)
}
```

Don't:

```kotlin
@Entity(tableName = "saved_items")
data class SavedItem(
    @PrimaryKey val id: String,
    val title: String,
    val isSelectedInUi: Boolean,
)
```

Reason: database shape and UI state usually change for different reasons.

Do:

```kotlin
@Database(
    entities = [SavedItemEntity::class],
    version = 2,
    autoMigrations = [AutoMigration(from = 1, to = 2)],
)
abstract class AppDatabase : RoomDatabase()
```

Don't:

```kotlin
Room.databaseBuilder(context, AppDatabase::class.java, "app.db")
    .fallbackToDestructiveMigration()
    .build()
```

Reason: destructive migration loses user data and must not be a default fix.

Do:

```kotlin
class PreferencesRepository(
    private val dataStore: DataStore<Preferences>,
) {
    val autoplayEnabled: Flow<Boolean> =
        dataStore.data.map { preferences -> preferences[AUTOPLAY_ENABLED] ?: true }
}
```

Don't:

```kotlin
@Composable
fun SettingsScreen(dataStore: DataStore<Preferences>) {
    LaunchedEffect(Unit) {
        dataStore.edit { it[booleanPreferencesKey("autoplay")] = true }
    }
}
```

Reason: preference ownership belongs in a repository or data source, not UI.

## Exceptions

- Entity/domain model reuse is acceptable for very small stable models only when persistence fields and app behavior are truly identical.
- In-memory storage can be used for ephemeral state that should not survive process death.
- Test-only databases may use destructive setup if they are clearly isolated from production code.

## Validation Expectations

- For Room schema changes, verify migrations and generated schema output.
- For DAO changes, add focused DAO or repository tests.
- For user-scoped data changes, test switching users or clearing user data when applicable.
- For DataStore changes, test default values and write/read behavior.
- If schema files change unexpectedly during validation or generation, stop and inspect the generated diff before keeping it.
