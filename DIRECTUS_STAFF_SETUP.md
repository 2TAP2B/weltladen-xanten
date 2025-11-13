# Directus Staff Members Collection Setup

## Collection Creation

### 1. Create Collection "staff_members"

**Collection Settings:**
- Collection Name: `staff_members`
- Display Name: `Mitarbeiter` (German) / `Staff Members` (English)
- Icon: `people`
- Note: `Team members and staff of Eine Welt Gruppe Xanten`
- Sort Field: `sort`
- Archive Field: `status`
- Archive Value: `archived`
- Unarchive Value: `draft`

## Field Configuration

### Core Identity Fields

#### 1. ID Field (Auto-created)
- **Field**: `id`
- **Type**: Primary Key
- **Interface**: Input (Read-only)

#### 2. Status Field
- **Field**: `status`
- **Type**: String
- **Interface**: Select Dropdown
- **Default Value**: `draft`
- **Options**:
  ```json
  {
    "choices": [
      { "text": "Entwurf", "value": "draft" },
      { "text": "Veröffentlicht", "value": "published" },
      { "text": "Archiviert", "value": "archived" }
    ]
  }
  ```

#### 3. Sort Field
- **Field**: `sort`
- **Type**: Integer
- **Interface**: Input
- **Default Value**: `1`
- **Note**: `Sortierreihenfolge (niedrigere Zahlen = höhere Priorität)`

### Personal Information

#### 4. Name
- **Field**: `name`
- **Type**: String
- **Interface**: Input
- **Required**: Yes
- **Width**: Full
- **Placeholder**: `Max Mustermann`
- **Note**: `Vollständiger Name des Mitarbeiters`

#### 5. Position
- **Field**: `position`
- **Type**: String
- **Interface**: Input
- **Required**: Yes
- **Width**: Full
- **Placeholder**: `Projektkoordinator`
- **Note**: `Position oder Rolle in der Organisation`

#### 6. Bio
- **Field**: `bio`
- **Type**: Text
- **Interface**: Textarea
- **Width**: Full
- **Rows**: 4
- **Placeholder**: `Kurze Beschreibung der Person und ihrer Aufgaben...`
- **Note**: `Biografische Information und Aufgabenbeschreibung`

#### 7. Photo
- **Field**: `photo`
- **Type**: UUID (File)
- **Interface**: File Image
- **Width**: Half
- **Accept**: `image/*`
- **Note**: `Profilbild des Mitarbeiters`

### Contact Information

#### 8. Email
- **Field**: `email`
- **Type**: String
- **Interface**: Input
- **Width**: Half
- **Placeholder**: `max.mustermann@example.com`
- **Validation**: Email format
- **Note**: `Haupt E-Mail Adresse`

#### 9. Phone
- **Field**: `phone`
- **Type**: String
- **Interface**: Input
- **Width**: Half
- **Placeholder**: `+49 123 456789`
- **Note**: `Festnetz oder Bürotelefon`

#### 10. Mobile
- **Field**: `mobile`
- **Type**: String
- **Interface**: Input
- **Width**: Half
- **Placeholder**: `+49 170 1234567`
- **Note**: `Mobiltelefonnummer (optional)`

### Organizational Information

#### 11. Department
- **Field**: `department`
- **Type**: String
- **Interface**: Select Dropdown
- **Width**: Half
- **Options**:
  ```json
  {
    "choices": [
      { "text": "Geschäftsführung", "value": "management" },
      { "text": "Bildung", "value": "education" },
      { "text": "Projekte", "value": "projects" },
      { "text": "Marketing", "value": "marketing" },
      { "text": "Verwaltung", "value": "administration" },
      { "text": "Freiwillige", "value": "volunteers" }
    ]
  }
  ```

#### 12. Specializations
- **Field**: `specializations`
- **Type**: Text
- **Interface**: Input
- **Width**: Half
- **Placeholder**: `Fairer Handel, Bildungsarbeit, Projektmanagement`
- **Note**: `Fachbereiche und Schwerpunkte (kommagetrennt)`

#### 13. Languages
- **Field**: `languages`
- **Type**: String
- **Interface**: Input
- **Width**: Half
- **Placeholder**: `Deutsch, Englisch, Spanisch`
- **Note**: `Gesprochene Sprachen (kommagetrennt)`

#### 14. Office Hours
- **Field**: `office_hours`
- **Type**: String
- **Interface**: Input
- **Width**: Half
- **Placeholder**: `Mo-Fr 9:00-17:00`
- **Note**: `Büro- oder Sprechzeiten`

### Social & Web Presence

#### 15. LinkedIn URL
- **Field**: `linkedin_url`
- **Type**: String
- **Interface**: Input
- **Width**: Half
- **Placeholder**: `https://linkedin.com/in/maxmustermann`
- **Validation**: URL format
- **Note**: `LinkedIn Profil (optional)`

#### 16. Website URL
- **Field**: `website_url`
- **Type**: String
- **Interface**: Input
- **Width**: Half
- **Placeholder**: `https://www.example.com`
- **Validation**: URL format
- **Note**: `Persönliche Website (optional)`

### Dates

#### 17. Date Joined
- **Field**: `date_joined`
- **Type**: Date
- **Interface**: Date
- **Width**: Half
- **Note**: `Datum des Eintritts in die Organisation`

#### 18. Date Created (Auto-created)
- **Field**: `date_created`
- **Type**: DateTime
- **Interface**: DateTime (Read-only)
- **Special**: `date-created`

#### 19. Date Updated (Auto-created)
- **Field**: `date_updated`
- **Type**: DateTime
- **Interface**: DateTime (Read-only)
- **Special**: `date-updated`

## Collection Layout Configuration

### List View
- **Primary Field**: `name`
- **Secondary Field**: `position`
- **Image Field**: `photo`
- **Status Field**: `status`

### Form Layout Groups

#### Group 1: "Persönliche Informationen"
- `name`
- `position`
- `photo`
- `bio`

#### Group 2: "Kontaktdaten"
- `email`
- `phone`
- `mobile`
- `office_hours`

#### Group 3: "Organisation"
- `department`
- `specializations`
- `languages`
- `date_joined`

#### Group 4: "Web & Social"
- `linkedin_url`
- `website_url`

#### Group 5: "System"
- `status`
- `sort`
- `date_created`
- `date_updated`

## Permissions Setup

### Public Role
- **Create**: No
- **Read**: Yes (only published items)
- **Update**: No
- **Delete**: No
- **Fields**: All except system fields

### Editor Role
- **Create**: Yes
- **Read**: Yes
- **Update**: Yes
- **Delete**: No
- **Fields**: All except system fields

### Admin Role
- **Create**: Yes
- **Read**: Yes
- **Update**: Yes
- **Delete**: Yes
- **Fields**: All fields

## Sample Data Entry

```json
{
  "status": "published",
  "sort": 1,
  "name": "Dr. Maria Schmidt",
  "position": "Geschäftsführerin",
  "bio": "Dr. Maria Schmidt leitet seit 2015 die Eine Welt Gruppe Xanten und ist Expertin für nachhaltigen Handel und Entwicklungszusammenarbeit.",
  "email": "m.schmidt@ewg-xanten.de",
  "phone": "+49 2801 12345",
  "mobile": "+49 170 1234567",
  "department": "management",
  "specializations": "Fairer Handel, Projektleitung, Öffentlichkeitsarbeit",
  "languages": "Deutsch, Englisch, Französisch",
  "office_hours": "Mo-Do 9:00-16:00",
  "linkedin_url": "https://linkedin.com/in/maria-schmidt",
  "date_joined": "2015-03-01"
}
```

## Integration Test

After setting up the collection, test the integration by:

1. Adding a few sample staff members
2. Visiting `/mitarbeiter` on your website
3. Verifying that data displays correctly
4. Testing responsive design on mobile/tablet
5. Checking that fallback to local content works if Directus is unavailable

## Notes

- All text fields should use German placeholders and help text
- Photo field should have proper image optimization settings
- Sort field allows manual ordering of staff members
- Status field provides draft/publish workflow
- Department field helps with categorization and filtering