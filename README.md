
## Ressourcen (für eine Stunde/Vortrag):
- Raum
- Lehrer
- Klasse
- Schüler
- Zeit
- Fach
- Vortrag/Stunde

## Raum:
- ID
- Name/Beschreibung
- Raumtypen # generic, labor, küche, büro
- Raumgröße/Anzahl der Plätze # 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
- Raumbelegung # Wann er frei oder belegt ist (array mit von bis zeiten) ["xx:xx-xx:xx"]

## Zeit:
- Zusätzliche Zeit zwischen den Stunden (laufen, pause, lüften, besprechen)
- Lehrer/Schüler benötigen Pausen wenn es passt (oder zu einer festgeleten uhrzeit)

## Lehrer:
- Name
- Typ # Lehrer, Dozent, Dozentin
- Fächer
- Krankmeldungen
- Verfügbarkeit 

## Schüler:
- Name
- Klassen/Kurse

## Aktion/Abfrage:
- Ist Ressource frei? (Lehrer, Raum, Klasse) für Zeitraum
- Setze/Gib Priorität
- Setze Hard/Soft constraint

## Beispiel Regeln:
- Lehrer + Klasse + Schüler kann nur in einen Raum zur gleichen Zeit sein
- Fach kann nur in bestimmten Raum stattfinden
- Fächer sollen in der Woche in einer bestimmten Reihenfolge sein
- Zeit zwischen den Stunden minimieren
- Laufen zwischen verschiedenen Räum-(komplexen) verringern

## Algorithmus 
Ein metaheuristischer evolutionärer Algorithmus
Variablen (G = Generations, P = Population, T = Stop Threshold, S = Selection percentage, M = Mutation probability)

- Lädt alle Ressourcen
- Lädt alle Regeln und sortiert nach Priorität
- Wiederholen bis nach T Durchläufen keine Verbesserung der Leistung festgestellt wird oder der Nutzer davor stoppt
	- G mal wiederholen:
		- P mal wiederholen:
			- Startet mit einer zufälligen Tabelle oder übernimmt eine des vorherigen Durchlaufes
			- Weißt diesem Durchlauf die Leistung 0 zu
			- Führt jede Regeln für jede Ressource aus
				- Wenn die Regel erfüllt ist wird deren Priorität zur Leistung addiert
				- Wenn die Regel verletzt ist wird deren Priorität von der Leistung subtrahiert
				- Wenn die Regel verletzt ist und sie zwingend erforderlich ist wird die Leistung auf 0 gesetzt und dieser Durchlauf beendet
		- Speichert und sortiert die Ergebnisse nach der Leistung der Durchläufe
		- Selektion (S Prozent der besten Durchläufe werden ausgewählt)
		- Rekombination (Für jeweils zwei der selektierten Durchläufe werden einige Einträge vertauscht)
		- Mutation (Mit einer Wahrscheinlichkeit von M werden einige Einträge vertauscht)
		- Population (Zusätzlich werden 100% - S an zufällig generierten Tabellen aufgefüllt)


## Schema:
```json
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
