***
[Zurück zu README.md](../../README.md)
***
# Technische Spezifikation (1 Stunde)

* Architektur (Firebase-only):

```
React PWA (Frontend)
        ↓
   Firebase SDK
        ↓
┌───────────────────────┐
│   Firebase Services:  │
│  • Firestore (Daten)  │
│  • Auth (Sicherheit)  │
│  • Hosting (Deploy)   │
│  • Functions (Logik)  │
└───────────────────────┘
```

* Firestore Collections Struktur:

```
//Zimmer
{
  "rooms": {
    "room_102": {
      "roomNumber": "102",
      "type": "DOUBLE", // SINGLE, DOUBLE, SUITE
      "currentPassword": "4297", // PIN
      "status": "OCCUPIED", // AVAILABLE, OCCUPIED, CLEANING, MAINTENANCE
      "currentGuestId": "guest_abc123", // link zu Gast
      "lastPasswordUpdate": "2024-01-15T14:00:00Z"
    },
    "room_103": {
      "roomNumber": "103", 
      "type": "SINGLE",
      "currentPassword": null, // frei
      "status": "AVAILABLE",
      "currentGuestId": null,
      "lastPasswordUpdate": null
    }
  }
}

//Authenticated Guests
{
  "guests": {
    "guest_room102_abc123": {
      "assignedRoom": "room_102", link zu zimmer
      "pinCode": "4297",
      "guestName": "Thomas Schmidt",
      "checkIn": "2024-01-15T14:00:00Z",
      "checkOut": "2024-01-18T10:00:00Z",
      "status": "CHECKED_IN", // CHECKED_IN, CHECKED_OUT, NO_SHOW
      "createdAt": "2024-01-15T14:00:00Z"
    }
  }
}

//Service Requests (geschützt)
{
  "requests": {
    "req_abc123": {
      "requestId": "req_abc123",
      "guestId": "guest_room102_abc123",
      "roomNumber": "102",
      "type": "TOWELS", // TOWELS, CLEANING, TAXI, WAKEUP,  OTHER
      "description": "2 zusätzliche Handtücher bitte",
      "status": "PENDING", // PENDING, ASSIGNED, COMPLETED
      "priority": "MEDIUM", // LOW, MEDIUM, HIGH, URGENT
      "createdAt": "2024-01-15T15:30:00Z",
      "completedAt": null
    }
  }
}

//Admin Access (separat)
{
  "admins": {
    "reception_desk": {
      "pinCode": "REC2024",
      "role": "RECEPTION",
      "lastLogin": "2024-01-15T08:00:00Z"
    }
  }
}
```

