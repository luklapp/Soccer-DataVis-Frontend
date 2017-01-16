# Report

## Datenset

Bei dem Datenset handelt es sich um ein Fußball-Datenset der Community [www.sozone.de](https://www.sozone.de). Darin enthalten sind 46.850 Tore von 242 Teams, sowie 61.116 Karten (gelb, gelb-rot, rot) von 216 Teams, jeweils aus den Spielen der nationalen Ligen.  

Sowohl für Tore, als auch für Karten sind jeweils die genaue Minute, der Spieler und das Team angegeben. Außerdem enthält die Datenbank detailliertere Informationen zu Teams und Spielern, wie zum Beispiel das Herkunftsland. Insgesamt sind 401.875 Datensätze in der Datenbank enthalten. 

## Tasks

Folgende Tasks haben wir uns vorgenommen: 

1. In welcher Zeit (in welcher Minute) werden die meisten Tore erzielt? 

2. Welches Team erzielt durchschnittlich die meisten Tore in den letzten 5 Minuten? 
  * "Bayern-Dusel" beweisen

3. Welches Team erzielt die meisten Tore / bekommt die meisten Karten in einer beliebigen Zeitspanne?

4. Spieler aus welchen Ländern erzielen die meisten Tore/Karten?

5. Möglichkeit, einzelne Länder/Team auszuwählen/zu vergleichen. 

## Design Konzept

**TODO**

## Prototype Interaction

Wir haben einige Interaktionen in unseren Prototypen eingebaut. So ist es möglich, dass sich durch eine Auswahl in einer Visualisierung fast alle anderen Visualisierungen ändern. Die einzige Visualisierung ohne Auswahlmöglichkeiten ist "Cards by Country". Dort haben wir uns gegen eine Auswahl entschieden, da die Länderauswahl bereits in "Goals by Country" integriert ist und wir es dort eindeutiger finden, da "Cards by Country" eine stacked bar chart ist und die Auswahl dort daher verwirrend sein könnte.

Insgesamt haben wir folgende Interaktionen implementiert: 

#### Minutenauswahl in "Total Goals and Cards per Minute"

In der Visualisierung "Total Goals and Cards per Minute" ist es mithilfe von zwei Grenzen (blau und rot) möglich, die Daten nur innerhalb von einem bestimmten Zeitraum im Spiel anzeigen so lassen. Während sich in dieser Visualisierung selbst nichts ändert, ist dies die einzige Auswahl, die Einfluss auf **alle** anderen Visualisierungen hat. Werden also beispielsweise die Grenzen auf 20. und 60. Minute gesetzt, zeigen alle anderen Visualisierungen nur Daten aus diesem Zeitraum an. 

Da diese Auswahl Einfluss auf alle anderen Visualisierungen hat, bleibt sie auch beim Scrollen immer am oberen Bildschirmrand. Jedoch kann sie mithilfe des Buttons "Toggle Minute-Slider" ausgeblendet werden. 

#### Auswahl eines Landes in "Goals by Country"

In der Visualisierung "Goals by Country" kann ein einzelnes Land ausgewählt werden. Dies hat Einfluss auf alle darunter liegenden Visualisierungen. So werden in "Average Goals and Cards by Club" alle Vereine hervorgehoben, die in einer Liga dieses Landes spielen. Auch in "Goals by Club" und "Cards by Club" werden diese Vereine hervorgehoben. Die Länderauswahl kann aufgehoben werden, indem man das gleiche Land noch einmal auswählt. Alternativ kann zu einem anderen Land gewechselt werden. Die Auswahl wird zurückgesetzt, sobald ein einzelner Verein ausgewählt wird.

#### Auswahl eines Vereins in "Goals by Club" und "Cards by Club"

In den Visualisierungen "Goals by Club" und "Cards by Club" kann ein einzelner Verein ausgewählt werden. Dieser wird dann in diesen beiden Visualisierungen, sowie in "Average Goals and Cards by Club" hervorgehoben. Wie auch bei der Länderauswahl wird diese zurückgesetzt, sobald man wieder ein Land auswählt.  

Sowohl bei der Länderauswahl, als auch bei der Vereinsauswahl bleibt die oben angeheftete Minutenauswahl bestehen. So ist es möglich, verschiedenste Filter zu kombinieren. So kann man beispielsweise alle deutschen Vereine hervorheben und deren Tore und Karten in der ersten Halbzeit (0. - 45. Minute) anzeigen lassen. 

In [diesem Video](https://github.com/luklapp/Soccer-DataVis-Frontend/blob/master/videos/d3_prototype_hoffmann_klappert.mov) sind alle Interaktionen dargestellt. 

## Insight

* Nach kurzer Einarbeitungszeit sind wir mithilfe des [D3 Tutorials](https://github.com/sgratzl/d3tutorial) gut zurechtgekommen
* Drag&Drop (Minuten-Slider) war einfacher als befürchtet, nachdem wir d3.drag() entdeckt haben
* Insgesamt sind wir zufrieden mit der Funktionalität. Vor allem die Vergleichbarkeit zwischen Vereinen verschiedener Länder halten wir für sehr gelungen
* Das Design ist vielleicht verbesserungswürdig, aber form follows function :P
* Nicht gelungen ist uns die Animation des stacked bar chart

**TODO**