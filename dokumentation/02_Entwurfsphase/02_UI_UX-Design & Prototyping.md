***
[Zurück zu README.md](../../README.md)
***
# UI/UX-Design & Prototyping (2 Stunden)

* Ergebnis: Login-Screens mit Sicherheit:

* Screen 1 - Gast Login:
    
```
┌─────────────────────┐  
│   Hotel Concierge   │  
│                     │    
│ Zimmernummer: 102   │  
│                     │  
│       PIN: ••••     │
│                     │
│                     │
│                     │
│    [ ANMELDEN ]     │
│                     │
└─────────────────────┘
```

* Screen 2 - Admin Login (separater Zugang):

```
┌─────────────────────┐
│   Admin-Bereich     │
│                     │
│   Admin-PIN: _____  │
│                     │
│                     │
│                     │
│     [ ZUGANG ]      │
└─────────────────────┘
```

* Screen 3 - Hauptmenü (nach Login):

```
Willkommen, Zimmer 102
━━━━━━━━━━━━━━━━━━━━━━━
Schnellzugriff:
[Handtücher]
[Reinigung]  
[Taxi]
[Wecker]

Meine Anfragen (2):
• Handtücher (in Bearbeitung)
• Taxi (erledigt)

[+ Neue Anfrage] [i Info]
```
   
* Screen 4 - Service-Anfrage:

```
Neue Service-Anfrage
━━━━━━━━━━━━━━━━━━━━━━━
Zimmer: 102
─────────────────────
Typ auswählen:
○ Handtücher & Bettwäsche
○ Zimmerreinigung
○ Taxi / Transfer
○ Weckdienst
○ Sonstiges

Zeitwunsch: [Heute 14-16 Uhr ▼]

Beschreibung:
[z.B. Bitte 2 zusätzliche Handtücher]

[ ANFRAGE SENDEN ]
```

* Screen 5 - Admin Dashboard:

```
ADMIN - Rezeption
━━━━━━━━━━━━━━━━━━━━━━━
Offen (3)
204 - Reinigung (09:45)
311 - Handtücher (09:30)
─────────────
Heute erledigt (5)
─────────────
Statistik: 12 Anfragen heute
```

* Design-Prinzipien:
    * Klare Trennung: Gast- und Admin-Bereiche getrennt
    * Security by Design: PIN-Eingabe prominent
    * Einfache Navigation: Maximal 2 Ebenen Tiefe

* Farbpalette:
    * Primär: #1a56db (Blau für Vertrauen)
    * Sekundär: #0e9f6e (Grün für Bestätigung)
    * Warnung: #f05252 (Rot für dringend)
    * Hintergrund: #f9fafb (Hellgrau)
    * Text: #111928 (Fast Schwarz)

