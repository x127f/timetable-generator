# Timetable-generation-algorithm

Ressourcen:
- Raum
- Lehrer
- Klassen
- Schüler
- Zeit
- Fach

Raum:
- ID
- Name/Beschreibung
- Raumtypen # generic, labor, küche, büro
- Raumgröße/Anzahl der Plätze # 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
- Raumbelegung # Wann er frei oder belegt ist (array mit von bis zeiten) ["xx:xx-xx:xx"]

Lehrer:
- Name
- Typ # Lehrer, Dozent, Dozentin
- Fächer
- Krankmeldungen
- Verfügbarkeit 

Schüler:
- Name
- Klassen/Kurse


Aktion/Abfrage:
- Ist Ressource frei? (Lehrer, Raum, Klasse) für Zeitraum
- Setze/Gib Priorität


```
[
	{
		"and": [
			{
				"or": [
					{
						"equals": "1==1"
					},
					{
						"equals": "1==0"
					}
				]
			},
			{
				"equals": "1==1"
			}
		]
	}
]

```

```json
{
	"ressources": {
		"lehrer": {}
	}
}
```
