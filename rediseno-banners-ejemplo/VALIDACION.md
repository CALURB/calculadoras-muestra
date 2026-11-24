# Registro de validación — Neto y Bruto (versión de pruebas)

Actualizado el 23/11/2026 (hora de Madrid). Resultados orientativos; cada herramienta declara en su página lo que no cubre.

## Estado por herramienta

| Herramienta | Contra qué se ha comprobado | Estado |
|---|---|---|
| Sueldo neto | Servicio oficial de retenciones de la AEAT (7 + 2 casos) | Coincide al céntimo (9/9) |
| Retención IRPF | Mismo motor y mismos 9 casos AEAT | Coincide al céntimo (9/9) |
| Del neto al bruto | 3 brutos calculados enviados a la AEAT; el neto resultante es el pedido | Coincide (3/3) |
| Coste empresa | Aritmética con los tipos de la Orden PJC/297/2026 (sin simulador oficial público) | Comprobado a mano |
| IVA | Aritmética con los tipos de la Ley 37/1992 | Comprobado a mano (4 casos) |
| Factura de autónomo | Aritmética IVA + recargo − retención (arts. 101 LIRPF / 95 RIRPF) | Comprobado a mano (4 casos) |
| Finiquito | Cálculo paso a paso (no hay simulador oficial) | Comprobado a mano (2 casos) |
| Despido | Ejemplos de la guía oficial del CGPJ v0.6 (la herramienta del CGPJ no se puede automatizar) + casos propios | Ejemplos de la guía reproducidos; casos propios a mano |
| Paro | Topes y porcentajes publicados por el SEPE 2026 y escala del art. 269 LGSS (el simulador del SEPE exige identificarse) | Comprobado a mano (5 casos) |
| Cuota de autónomos | Bases del art. 18 de la Orden PJC/297/2026 (16 importes cotejados con el texto del BOE) × 31,50 % | Comprobado a mano (6 casos) |

## 1. IRPF y sueldo neto — servicio oficial de la AEAT

Servicio: https://www2.agenciatributaria.gob.es/wlpl/PRET-R200/mc (EJER=2026, PER=1 → algoritmo vigente desde el 10/09/2026).
Especificación: https://sede.agenciatributaria.gob.es/static_files/Sede/Programas_ayuda/Retenciones/2026/espeSWRET_2026.pdf
NIF de prueba ficticios con formato válido (12345678Z, 87654321X). Cotizaciones = cuotas del trabajador calculadas por nuestro motor.

| Caso | Descripción | Bruto | Cotizaciones | Tipo nuestro | Tipo AEAT | Retención nuestra | Retención AEAT | Sello |
|---|---|---|---|---|---|---|---|---|
| A | 22.000 €, soltero/a sin hijos, indefinido, 14 pagas | 22000 | 1430 | 11.96 | 11.96 | 2631.2 | 2631.2 | 9E44283DF606M |
| B | 30.000 €, casado/a con cónyuge sin rentas (sit. 2), 2 hijos (2015 y 2024) | 30000 | 1950 | 11.25 | 11.25 | 3375 | 3375.0 | 31622EC13FAAM |
| C | 70.000 €, sin hijos (por encima de la base máxima) | 70000 | 3996.16 | 26.64 | 26.64 | 18648 | 18648.0 | 00E1E7C61593M |
| D | 18.000 €, temporal de menos de un año | 18000 | 1179 | 5.07 | 5.07 | 912.6 | 912.6 | 4ACDE6A32062M |
| E | 16.500 €, monoparental (sit. 1) con 1 hijo (2020) | 16500 | 1111.03 | 0 | 0.0 | 0 | 0.0 | A98ACA7B5EFFM |
| F | 40.000 €, sit. 3 con 3 hijos (2012, 2016, 2025), mayor de 65 no | 40000 | 2600 | 12.6 | 12.6 | 5040 | 5040.0 | 462F203BA314M |
| G | 25.000 €, 67 años (nacido 1959), sin hijos | 25000 | 1625 | 13.22 | 13.22 | 3305 | 3305.0 | 45ABF404E5C6M |

Casos extra: 15.000 € temporal <1 año → AEAT 2,00 % / 300,00 € (nuestro 2,00 % / 300,00 €); 19.000 € indefinido → AEAT 7,07 % / 1.343,30 € (nuestro igual).

## 2. Del neto al bruto — comprobación inversa con la AEAT

Se calcula el bruto con nuestro motor y se envía ese bruto (con sus cotizaciones) al servicio de la AEAT. Neto con AEAT = bruto − cotizaciones − retención AEAT.

| Objetivo | Bruto calculado | Cotizaciones | Tipo nuestro | Tipo AEAT | Retención AEAT | Neto con AEAT | Sello |
|---|---|---|---|---|---|---|---|
| 1.600 € netos al mes, 14 pagas, soltero/a, indefinido | 29.378,25 | 1.909,59 | 16,17 % | 16,17 % | 4.750,46 | 22.718,20 al año (ordinaria 1.600,00) | E9AEE648E1F6M |
| 30.000 € netos al año, casado/a (sit. 2), 2 hijos, 12 pagas | 39.021,85 | 2.536,42 | 16,62 % | 16,62 % | 6.485,43 | 30.000,00 al año (ordinaria 2.500,00) | 6C419F47EB56M |
| 1.250 € netos al mes, temporal, 14 pagas | 21.621,31 | 1.416,19 | 11,42 % | 11,42 % | 2.469,15 | 17.735,97 al año (ordinaria 1.250,00) | BCADD017DE89M |

## 3. Coste empresa

24.000 €, indefinido, grupo 4-7, oficina: base 2.000 €/mes. Empresa: CC 23,60 + desempleo 5,50 + FOGASA 0,20 + FP 0,60 + MEI 0,75 + AT/EP 1,50 = 32,15 % → 7.716 €/año; coste total 31.716 €. Trabajador 6,50 % → 1.560 €/año. Coincide con la página.

## 4. IVA

| Caso | Base | Cuota | Total |
|---|---|---|---|
| Añadir 21 % a 100 | 100,00 | 21,00 | 121,00 |
| Quitar 21 % de 121 | 100,00 | 21,00 | 121,00 |
| Añadir 10 % a 50 | 50,00 | 5,00 | 55,00 |
| Quitar 4 % de 10,40 | 10,00 | 0,40 | 10,40 |

## 5. Factura de autónomo

| Caso | Base | IVA | Recargo | Retención | Total |
|---|---|---|---|---|---|
| 1.000 €, 21 %, ret. 15 % | 1.000,00 | 210,00 | 0,00 | 150,00 | 1.060,00 |
| 1.000 €, 21 %, ret. 7 % | 1.000,00 | 210,00 | 0,00 | 70,00 | 1.140,00 |
| 1.000 €, 21 %, recargo 5,2 %, sin ret. | 1.000,00 | 210,00 | 52,00 | 0,00 | 1.262,00 |
| Inverso: quiero cobrar 1.060 € (21 %, 15 %) | 1.000,00 | 210,00 | 0,00 | 150,00 | 1.060,00 |

## 6. Finiquito

- Alta 2022-03-01, baja 2026-11-23, 21.000,00 € en 14 pagas, 30 días de vacaciones (10 disfrutados), 1 extra cobrada(s): salario del mes 1.150,00 (23/30 días) + vacaciones 16,88 días × 57,53 = 970,99 + extras 1.187,67 = **3.308,66 €**.
- Alta 2026-06-01, baja 2026-06-30, 18.000,00 € en 12 pagas, 30 días de vacaciones (0 disfrutados), 0 extra cobrada(s): salario del mes 1.500,00 (30/30 días) + vacaciones 2,47 días × 49,32 = 121,60 + extras 0,00 = **1.621,60 €**.

## 7. Despido (criterios CGPJ, guía v0.6 de julio de 2026)

Meses: toda fracción cuenta como mes completo. 2026-01-01→2026-02-01: 2 meses; 2026-01-15→2026-03-14: 2 meses; 2026-01-01→2026-04-01: 4 meses.

| Alta | Baja | Salario anual | Tipo | Días | Importe | Nota |
|---|---|---|---|---|---|---|
| 2012-02-11 | 2012-02-12 | 36.500,00 | improcedente | 6,50 | 648,22 | Ejemplo de la guía CGPJ: 3,75 + 2,75 = 6,50 días |
| 2018-05-14 | 2026-11-23 | 24.000,00 | improcedente | 283,25 | 18.624,66 |  |
| 2018-05-14 | 2026-11-23 | 24.000,00 | objetivo | 171,67 | 11.287,89 |  |
| 2005-03-01 | 2026-11-23 | 30.000,00 | improcedente | 720,00 | 59.178,08 | Tope de 720 días aplicado |
| 1990-01-01 | 2026-11-23 | 30.000,00 | improcedente | 997,50 | 81.986,30 | Lo devengado hasta el 11/02/2012 (266 meses × 3,75 = 997,50 días) supera 720: se mantiene, con máximo de 1.260 (DT 11ª ET) |
| 2025-11-24 | 2026-11-23 | 20.000,00 | temporal | 12,00 | 657,53 | 365 días × 12/365 |

## 8. Paro (arts. 269–270 LGSS; cuantías SEPE 2026)

| Base reguladora | Hijos | Días cotizados | 1.º–180.º día | Desde el 181 | Duración | Total bruto |
|---|---|---|---|---|---|---|
| 2.000,00 | 0 | 1500 | 1.225,00 | 1.200,00 | 480 días | 19.350,00 |
| 2.000,00 | 1 | 1500 | 1.400,00 | 1.200,00 | 480 días | 20.400,00 |
| 900,00 | 0 | 400 | 630,00 | 560,00 | 120 días | 2.520,00 |
| 1.000,00 | 2 | 2190 | 749,00 | 749,00 | 720 días | 17.976,00 |
| 6.000,00 | 2 | 2200 | 1.575,00 | 1.575,00 | 720 días | 37.800,00 |

## 9. Cuota de autónomos (art. 18 Orden PJC/297/2026; tipo 31,50 %)

| Rendimiento anual | Societario | Computable/mes | Tramo | Base mínima | Cuota mínima |
|---|---|---|---|---|---|
| 8.000,00 | no | 620,00 | Reducida 1 | 653,59 | 205,88 |
| 15.000,00 | no | 1.162,50 | Reducida 3 | 849,67 | 267,65 |
| 30.000,00 | no | 2.325,00 | General 6 | 1.274,51 | 401,47 |
| 60.000,00 | no | 4.650,00 | General 11 | 1.732,03 | 545,59 |
| 90.000,00 | no | 6.975,00 | General 12 | 1.928,10 | 607,35 |
| 30.000,00 | sí | 2.425,00 | General 7 | 1.356,21 | 427,21 |

## Pendiente de confirmar

- Tarifa plana de autónomos 2026: la Tesorería aplica 80 €/mes (+ MEI), pero ninguna norma de 2026 fija la cuantía; no se calcula.
- Grupos de cotización 8 a 11: base diaria (47,48 €) aproximada a 1.424,40 €/mes.
- AT/EP: solo cinco ocupaciones del cuadro II; el cuadro I (por CNAE) no está.
- Paro: no se calculan los descuentos (cotización del 4,85 % y retención de IRPF).
- Finiquito: devengo de pagas extra de enero a diciembre; los convenios pueden fijar otro.
